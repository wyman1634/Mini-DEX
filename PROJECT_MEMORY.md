# Project Memory

Durable, non-secret context for resuming the Avalanche Bootcamp Task 7 work. Revalidate external state before relying on it.

## Security and credential recovery

- No plaintext private key, mnemonic, password, decrypted keystore, backend signer key, or JWT belongs in this repository.
- The Fuji deployer/signer is `0x3cd247C0ebAb3D4702dB33250dA14D91AE79d430`.
- Its encrypted credential and macOS Keychain recovery procedure are maintained in [`../avalanche-erc20-dapp/PROJECT_MEMORY.md`](../avalanche-erc20-dapp/PROJECT_MEMORY.md). Read that file before any deployment, signing, or credential action.
- Retrieve the Keychain password only inside the signing process or directly to the clipboard; do not print it. The password is not the private key, and both the encrypted credential and Keychain entry are required.

## Code state

- Repository: <https://github.com/wyman1634/Mini-DEX>
- Branch: `submission/wyman1634-task7`
- Base: upstream commit `992c94e`
- Self-trade prevention: `7acfe8a`
- Reproducible Fuji two-address demo: `d7447dc14f21c7555aed77e37a6df672c68e4e65`
- Expected clean verification: server 29 tests + typecheck; contracts 13 tests; web 10 tests + typecheck + production build.

## Fuji deployment

- Network: Avalanche Fuji C-Chain (`43113`)
- Deployment block: `58610686`
- Vault: [`0x90b3bADC1D5b4FDCa4234038686624Cea5c1B191`](https://testnet.snowtrace.io/address/0x90b3bADC1D5b4FDCa4234038686624Cea5c1B191)
- MockUSDC: [`0xb1cE732aE975df1Adc94035705Ece41D13f8B1EC`](https://testnet.snowtrace.io/address/0xb1cE732aE975df1Adc94035705Ece41D13f8B1EC)
- MockWAVAX: [`0x92AB830340679bEeD4FA7ff76451e989Bcb97329`](https://testnet.snowtrace.io/address/0x92AB830340679bEeD4FA7ff76451e989Bcb97329)
- RPC verification on 2026-09-23 found nonempty runtime bytecode at all three addresses, the expected Vault signer, enabled tokens, and the expected token symbols.

## Public transaction evidence

- Deposit 100 USDC: [`0x8def0ed249503ae4b55c35a9c61b08a0826b9ed4565dfb1d564db729bbf35002`](https://testnet.snowtrace.io/tx/0x8def0ed249503ae4b55c35a9c61b08a0826b9ed4565dfb1d564db729bbf35002)
- Deposit 5 WAVAX: [`0xb80ff0791fe07d6cfce16832f5926414ceb28047f1b3b7dd17aab20b2dd43d42`](https://testnet.snowtrace.io/tx/0xb80ff0791fe07d6cfce16832f5926414ceb28047f1b3b7dd17aab20b2dd43d42)
- Withdraw 50 USDC: [`0xf03d794723ded7c00462bba00757d68c3bdd987263cca8ff1a2a5821cc55ddf1`](https://testnet.snowtrace.io/tx/0xf03d794723ded7c00462bba00757d68c3bdd987263cca8ff1a2a5821cc55ddf1)
- Counterparty deposit 100 USDC: [`0x5f6a545267d7c30c9e8697d79e9b2be52e96b82bb8e90e0ad917d0bf6c23de74`](https://testnet.snowtrace.io/tx/0x5f6a545267d7c30c9e8697d79e9b2be52e96b82bb8e90e0ad917d0bf6c23de74)
- Verified trade: maker `0x3cd247C0ebAb3D4702dB33250dA14D91AE79d430`, taker `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`, price `20 USDC`, quantity `1 WAVAX`.

## Submission

- Bootcamp branch: `submission/wyman1634-task7`
- Submission commit: `9164ef73b27df9d5f676309355b0acb7d2b4ee89`
- Official PR: <https://github.com/openbuildxyz/Avalanche-101-Bootcamp/pull/134>
- Evidence path: `learn/wyman1634/task7/`
- Last checked on 2026-09-26: PR open, ready for review, mergeable, clean, and limited to the Task 7 README plus five evidence images.

## Resume checklist

1. Confirm both repositories' branches and clean worktrees.
2. Revalidate PR state and the listed Fuji receipts/code with read-only calls.
3. Run the verification commands relevant to any changed package.
4. Update this file when a deployment, public transaction, branch, commit, evidence artifact, or PR state changes.
