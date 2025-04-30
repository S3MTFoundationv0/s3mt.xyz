# S3MT – Synthetic Metals Token Protocol

S3MT is an open-source decentralized protocol built on Solana that issues tokenized, synthetic representations of real-world metals. Token holders can participate in presales, earn on-chain yield, redeem tokens for value, and drive protocol direction through DAO governance.

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Tokenomics Summary](#tokenomics-summary)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The S3MT protocol aims to democratize access to commodity markets by minting synthetic tokens that track the value of precious metals such as gold, silver, and platinum. Leveraging Solana’s high throughput and low fees, S3MT provides:

- **Institutional-grade custody** via decentralized price oracles
- **Presale mechanism** to bootstrap initial liquidity and community participation
- **On-chain yield distribution** from protocol fees and revenue streams
- **Burn-to-value** redemption allowing holders to redeem tokens for real-world value
- **DAO Governance** empowering token holders to propose and vote on protocol upgrades

## Key Features

- **Presale Smart Contract**: Anchor-based Solana program to manage token presale.
- **Yield Distributor**: Automatically distributes fees proportionally to token holders.
- **Redemption Mechanism**: Burn tokens for USD stablecoins or underlying assets.
- **DAO Module**: Governance framework for on-chain proposal and voting.
- **Oracle Integration**: Reliable price feeds from Chainlink or Pyth network.

## Technology Stack

- **Blockchain**: Solana
- **Smart Contracts**: Rust, Anchor framework
- **Frontend**: Nuxt 3 (Vue 3, TypeScript), Tailwind CSS
- **Wallet Integration**: @solana/wallet-adapter
- **Containerization**: Docker, Traefik, local Solana Validator
- **Build & Automation**: Node.js, Yarn, Makefile scripts

## Architecture

```mermaid
graph LR
  A[User Wallet] -->|Interact| B[Frontend (Nuxt 3)]
  B --> C[Solana RPC / Traefik]
  C --> D[Presale Program (Anchor)]
  C --> E[DAO Program (Anchor)]
  D --> F[Yield Distributor]
  E --> G[DAO Treasury]
```

## Documentation

Comprehensive project documentation and whitepapers are located in the `docs/` directory:

- **Project Overview**: `docs/S3MT — Project Overview.docx`
- **Whitepaper (Goldpaper)**: `docs/S3MT - Goldpaper.pdf`
- **Tokenomics Model**: `docs/S3MT Tokenomics v1.1.docx`
- **Stack Selection Spec**: `docs/S3MT Smart Contract Stack Selection.pdf`
- **Presale Timeline & Milestones**: `docs/S3MT Presale Timeline & Key Milestones.docx`
- **ELI5 Objective**: `docs/S3MT - ELI5 Objective.docx`
- **Burn-to-Value Mechanism**: `docs/S3MT - Token Burn-to-Value Redemption Mechanism.docx`
- **Yield Distribution Mechanism**: `docs/S3MT - Yield Distribution Mechanism for Token Holders.docx`

## Tokenomics Summary

| Allocation                  | Percentage |
| --------------------------- | ---------- |
| Presale                     | 30%        |
| Liquidity & Market Making   | 20%        |
| DAO Treasury                | 15%        |
| Team & Advisors (vested)    | 15%        |
| Community & Airdrops        | 10%        |
| Yield & Rewards Pool        | 10%        |

> For a detailed breakdown of vesting schedules, lockup periods, and mechanisms, see `docs/S3MT Tokenomics v1.1.docx`.

## Getting Started

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-org/s3mt.git
   cd s3mt
   ```
2. Install dependencies:  
   ```bash
   yarn install
   ```
3. Start the development server:  
   ```bash
   yarn dev
   ```
4. Build for production:  
   ```bash
   yarn build
   ```
5. Launch with Docker (optional):  
   ```bash
   make dev
   ```

## Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes with clear messages: `git commit -m "feat: description"`.
4. Open a Pull Request and describe your work.

Refer to `CONTRIBUTING.md` (if available) or open issues to discuss ideas.

## License

This project is licensed under the MIT License.  
See [LICENSE](LICENSE) for details.

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
