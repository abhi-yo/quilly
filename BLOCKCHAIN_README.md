# 🚀 Quilly Blockchain Integration

This document outlines the Web3 blockchain features integrated into the Quilly content platform, including token-based tipping, copyright protection, and DAO governance.

## 🎯 Current Implementation Status

### ✅ Implemented Features

- **QUILL Token (ERC-20)**: Native platform token for tipping
- **Wallet Connection**: MetaMask integration with Polygon Amoy testnet
- **Token Faucet**: Users can claim 100 QUILL tokens every 24 hours
- **Tipping System**: Send tokens to writers with transaction recording
- **Frontend Components**: Complete UI for wallet connection and tipping

### 🚧 Planned Features

- **Copyright Protection**: Register articles on blockchain
- **DAO Governance**: Community proposals and voting
- **NFT Integration**: Mint articles as NFTs

## 🔧 Technical Architecture

### Smart Contracts (Polygon Amoy Testnet)

#### QuillyToken.sol

```solidity
contract QuillyToken is IERC20 {
    // ERC-20 compliant token
    // Built-in faucet mechanism (100 QUILL per claim)
    // Tipping functionality with event logging
    // 1,000,000 total supply
    // 24-hour faucet cooldown
}
```

#### CopyrightProtection.sol (Planned)

```solidity
contract CopyrightProtection {
    // Content hash registration
    // Ownership verification
    // Plagiarism detection
    // IPFS integration
}
```

#### DAOGovernance.sol (Planned)

```solidity
contract DAOGovernance {
    // Proposal creation (1000 QUILL minimum)
    // Token-weighted voting
    // 7-day voting periods
    // Automatic execution logic
}
```

### Frontend Integration

Located in `/components/blockchain/`:

- **WalletConnect.tsx**: MetaMask connection and balance display
- **TipWriter.tsx**: Token tipping interface for articles
- **CopyrightProtection.tsx**: Content registration (planned)
- **DAOGovernance.tsx**: Proposal and voting system (planned)

### Web3 Service Layer

`/lib/web3.ts` provides:

- Wallet connection management
- Smart contract interaction
- Network switching (Polygon Amoy)
- Demo mode for development
- Transaction handling

## 🌐 Network Configuration

### Polygon Amoy Testnet

```javascript
{
  chainId: '0x13882', // Updated to Amoy testnet
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
}
```

## 🚀 Getting Started

### Prerequisites

- MetaMask wallet installed
- Polygon Amoy testnet configured
- Test MATIC for gas fees (get from [Polygon Faucet](https://faucet.polygon.technology/))

### Environment Variables

```bash
# Blockchain configuration
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
PRIVATE_KEY=your_deployment_private_key

# Contract addresses (set after deployment)
NEXT_PUBLIC_QUILLY_TOKEN_ADDRESS=deployed_token_address
NEXT_PUBLIC_COPYRIGHT_PROTECTION_ADDRESS=deployed_copyright_address
NEXT_PUBLIC_DAO_GOVERNANCE_ADDRESS=deployed_dao_address
```

### Smart Contract Deployment

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Compile Contracts**

   ```bash
   npx hardhat compile
   ```

3. **Deploy to Amoy Testnet**

   ```bash
   npx hardhat run scripts/deploy.js --network polygonAmoy
   ```

4. **Verify Contracts**
   ```bash
   npx hardhat verify --network polygonAmoy CONTRACT_ADDRESS
   ```

## 💡 How to Use Blockchain Features

### 1. Connect Wallet

- Visit any article page or `/blockchain`
- Click "Connect MetaMask"
- Approve network switch to Polygon Amoy
- Wallet address and balance displayed

### 2. Claim QUILL Tokens

```javascript
// Automatic faucet integration
const claimTokens = async () => {
  await web3Service.claimFaucet();
  // User receives 100 QUILL tokens
  // 24-hour cooldown applies
};
```

### 3. Tip Writers

```javascript
// Tip functionality on article pages
const tipWriter = async (amount, articleId) => {
  await web3Service.tipWriter(writerAddress, amount, articleId);
  // Transaction recorded on blockchain
  // Writer receives tokens
};
```

### 4. Article Integration

- Each article page includes TipWriter component
- Writer wallet addresses linked to user profiles
- Transaction history tracked in database
- Real-time balance updates

## 📊 Token Economics

- **Total Supply**: 1,000,000 QUILL
- **Faucet Amount**: 100 QUILL per claim
- **Faucet Cooldown**: 24 hours
- **Gas Fees**: Paid in MATIC
- **Tipping**: Direct writer-to-writer transfers

## 🔒 Security Features

### Smart Contract Security

- Reentrancy protection using checks-effects-interactions
- Access control with owner modifiers
- Input validation for all functions
- Event emission for transparency

### Frontend Security

- Wallet connection validation
- Transaction confirmation dialogs
- Error handling for failed transactions
- Demo mode for testing without real tokens

## 🛠️ Development Workflow

### Local Testing

```bash
# Start local hardhat node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Run contract tests
npx hardhat test
```

### Integration Testing

- Demo mode automatically enabled when contracts not deployed
- Simulated transactions for UI testing
- Mock data for development environment

## 🎯 Roadmap

### Phase 1: Current (Tipping System) ✅

- QUILL token deployment
- MetaMask integration
- Basic tipping functionality
- Frontend components

### Phase 2: Content Protection 🚧

- Copyright registration smart contract
- Content hash verification
- Plagiarism detection
- IPFS integration for content storage

### Phase 3: DAO Governance 🚧

- Governance token mechanics
- Proposal creation and voting
- Treasury management
- Community decision making

### Phase 4: Advanced Features 📋

- Multi-token support
- NFT article minting
- Cross-chain compatibility
- Advanced analytics

## 🔧 Configuration

### Hardhat Configuration

```javascript
// hardhat.config.js
networks: {
  polygonAmoy: {
    url: process.env.POLYGON_AMOY_RPC,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 80002
  }
}
```

### Next.js Integration

- API routes for transaction logging
- Server-side wallet address validation
- Database integration for transaction history
- Real-time balance updates

## 📞 Support & Troubleshooting

### Common Issues

1. **MetaMask Connection**: Ensure Polygon Amoy is added to networks
2. **Transaction Failures**: Check MATIC balance for gas fees
3. **Demo Mode**: Contracts automatically use demo mode if not deployed
4. **Network Switching**: Application handles network switching automatically

### Useful Links

- [Polygon Amoy Faucet](https://faucet.polygon.technology/)
- [Amoy Block Explorer](https://amoy.polygonscan.com/)
- [MetaMask Documentation](https://docs.metamask.io/)

## ⚠️ Important Notes

- **Testnet Only**: Current deployment uses Polygon Amoy testnet
- **Demo Mode**: Application works without deployed contracts
- **Test Tokens**: QUILL tokens have no real-world value
- **Gas Fees**: Always ensure sufficient MATIC for transactions

---
