# Agent Guide

## Working rules

- Inspect the relevant package, tests, and configuration before editing; preserve the existing npm/Foundry workflow and code style.
- Keep changes scoped to the active task and run the narrow test first, then the affected package's full verification.
- Keep private keys, mnemonics, encryption passwords, JWTs, decrypted keystores, and `.env` contents out of commands that print them, screenshots, documentation, commits, and PRs.

## Progressive disclosure

- **Task 7, Fuji deployment, live signing, evidence, PR continuation, or credential recovery:** read [`PROJECT_MEMORY.md`](PROJECT_MEMORY.md) completely before acting. Completion means current public chain state, local branch state, and PR state have all been revalidated.
- **Contracts or withdrawal authorization:** read [`contracts/README.md`](contracts/README.md), then the affected source and tests. Completion means `forge test` passes and Solidity/backend EIP-712 fields still agree.
- **Server matching, authentication, ledger, or Fuji scripts:** read the relevant sections of [`README.md`](README.md), then the affected module and its tests. Completion means server tests and typecheck pass.
- **Web UI, wallet connection, or screenshots:** read the relevant sections of [`README.md`](README.md), then the affected component and hooks. Completion means web tests, typecheck, and production build pass; screenshots must not expose credentials.

