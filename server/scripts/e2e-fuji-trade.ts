// Fuji 双账户撮合演示：账户 A 挂卖单，账户 B 充值后吃单。
// 用法：USER_A_KEY=0x... USER_B_KEY=0x... npx tsx scripts/e2e-fuji-trade.ts
import "dotenv/config";
import {
  createPublicClient,
  createWalletClient,
  getAddress,
  http,
  parseAbi,
  parseEther,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { avalancheFuji } from "viem/chains";

const BASE = process.env.SERVER_URL ?? "http://localhost:8787";
const RPC = process.env.RPC_URL!;
const CHAIN_ID = Number(process.env.CHAIN_ID);
const VAULT = getAddress(process.env.VAULT_ADDRESS!);
const USDC = getAddress(process.env.USDC_ADDRESS!);
const accountA = privateKeyToAccount(process.env.USER_A_KEY as Hex);
const accountB = privateKeyToAccount(process.env.USER_B_KEY as Hex);
const pub = createPublicClient({ chain: avalancheFuji, transport: http(RPC) });
const walletA = createWalletClient({ account: accountA, chain: avalancheFuji, transport: http(RPC) });
const walletB = createWalletClient({ account: accountB, chain: avalancheFuji, transport: http(RPC) });
const tokenAbi = parseAbi([
  "function mint(address,uint256)",
  "function approve(address,uint256) returns (bool)",
]);
const vaultAbi = parseAbi(["function deposit(address token,uint256 amount)"]);

async function api<T = any>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.token ? { authorization: `Bearer ${init.token}` } : {}),
    },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${JSON.stringify(body)}`);
  return body as T;
}

async function waitTx(hash: Hex, label: string) {
  const receipt = await pub.waitForTransactionReceipt({ hash });
  console.log(`${label}: ${receipt.status} https://testnet.snowtrace.io/tx/${hash}`);
  if (receipt.status !== "success") throw new Error(`${label} reverted`);
}

async function login(account: typeof accountA) {
  const { nonce } = await api<{ nonce: string }>(`/auth/nonce?address=${account.address}`);
  const signature = await account.signTypedData({
    domain: { name: "MiniDex", version: "1", chainId: CHAIN_ID },
    types: {
      Login: [
        { name: "address", type: "address" },
        { name: "nonce", type: "string" },
        { name: "statement", type: "string" },
      ],
    },
    primaryType: "Login",
    message: { address: account.address, nonce, statement: "Sign in to MiniDex" },
  });
  return (await api<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ address: account.address, nonce, signature }),
  })).token;
}

async function waitForUsdc(token: string, minimum: number) {
  const started = Date.now();
  while (Date.now() - started < 90_000) {
    const balances = await api<any>("/balances", { token });
    if (Number(balances.USDC.available) >= minimum) return balances;
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw new Error("等待账户 B 的 USDC 入账超时");
}

async function main() {
  if (accountA.address === accountB.address) throw new Error("演示需要两个不同地址");
  console.log(`账户 A (maker): ${accountA.address}`);
  console.log(`账户 B (taker): ${accountB.address}`);

  if ((await pub.getBalance({ address: accountB.address })) < parseEther("0.005")) {
    await waitTx(
      await walletA.sendTransaction({ to: accountB.address, value: parseEther("0.01") }),
      "fund B gas",
    );
  }
  await waitTx(
    await walletA.writeContract({ address: USDC, abi: tokenAbi, functionName: "mint", args: [accountB.address, 100n * 10n ** 6n] }),
    "mint B 100 USDC",
  );
  await waitTx(
    await walletB.writeContract({ address: USDC, abi: tokenAbi, functionName: "approve", args: [VAULT, 100n * 10n ** 6n] }),
    "approve B 100 USDC",
  );
  await waitTx(
    await walletB.writeContract({ address: VAULT, abi: vaultAbi, functionName: "deposit", args: [USDC, 100n * 10n ** 6n] }),
    "deposit B 100 USDC",
  );

  const [tokenA, tokenB] = await Promise.all([login(accountA), login(accountB)]);
  await waitForUsdc(tokenB, 100);
  const makerResult = await api<any>("/orders", {
    method: "POST",
    token: tokenA,
    body: JSON.stringify({ side: "sell", type: "limit", price: "20", qty: "1" }),
  });
  const takerResult = await api<any>("/orders", {
    method: "POST",
    token: tokenB,
    body: JSON.stringify({ side: "buy", type: "market", qty: "1" }),
  });
  const fill = takerResult.fills?.[0];
  if (!fill || fill.maker.toLowerCase() !== accountA.address.toLowerCase() || fill.taker.toLowerCase() !== accountB.address.toLowerCase()) {
    throw new Error(`成交参与者不符合预期: ${JSON.stringify(takerResult)}`);
  }

  console.log("maker order:", JSON.stringify(makerResult.order));
  console.log("verified fill:", JSON.stringify(fill));
  console.log("A balances:", JSON.stringify(await api("/balances", { token: tokenA })));
  console.log("B balances:", JSON.stringify(await api("/balances", { token: tokenB })));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
