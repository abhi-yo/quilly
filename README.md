# Quilly - Modern Content Publishing Platform

A distraction-free writing platform with blockchain-powered copyright protection, built with Next.js and deployed on Polygon.

## ✨ Features

### 🔐 Authentication & User Management

- Email/password authentication with OTP verification
- Google OAuth integration
- Role-based access (Reader/Writer)
- Secure session management with NextAuth

### ✍️ Content Creation & Management

- Rich text editor with formatting toolbar
- Auto-save functionality with local storage
- Tags system for content discovery
- Article search and filtering
- Real-time preview mode
- Clean, distraction-free writing interface

### 🌐 Content Discovery

- Explore page with article listings
- Tag-based filtering and search
- Article analytics and engagement metrics
- Comment system for reader interaction

### 📊 Analytics Dashboard

- Writer analytics: views, engagement rates
- Reader dashboard: reading stats
- Performance metrics and trends
- Content statistics

### ⛓️ Blockchain Copyright Protection

- **Real blockchain registration** on Polygon Amoy testnet
- **Immutable copyright proof** with content hashing (SHA-256)
- **Public verification** via Polygonscan
- **Plagiarism detection** before registration
- **MetaMask wallet integration**
- **Permanent ownership records** accessible worldwide

#### Copyright Features:

- Select any article for blockchain protection
- Generate unique content hashes
- Pay minimal gas fees (0.001 MATIC)
- Get permanent, tamper-proof ownership proof
- Verify copyright status online anytime

## 🛠️ Tech Stack

### Frontend

- **Next.js 13.5.1** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **NextAuth.js** - Authentication

### Backend

- **MongoDB** - Database with Mongoose ODM
- **Node.js** - Runtime environment
- **Vercel** - Deployment platform

### Blockchain

- **Polygon Amoy Testnet** - Layer 2 blockchain
- **Ethers.js v6** - Blockchain interaction
- **Hardhat** - Smart contract development
- **Solidity 0.8.20** - Smart contract language
- **MetaMask** - Wallet integration

### Smart Contracts

- **CopyrightProtection.sol** - Content registration and verification
- **Deployed on Polygon Amoy**: `0xeAeE2316D793068c34EbC322e1F8a98dCBAF9f69`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB database
- MetaMask wallet (for blockchain features)
- Polygon Amoy testnet MATIC tokens

### Environment Variables

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Optional)
RESEND_API_KEY=your_resend_api_key

# Blockchain
NEXT_PUBLIC_COPYRIGHT_PROTECTION_ADDRESS=0xeAeE2316D793068c34EbC322e1F8a98dCBAF9f69
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
PRIVATE_KEY=your_wallet_private_key_for_deployment
```

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd contentplatform
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Fill in your environment variables
```

4. **Run the development server**

```bash
pnpm dev
```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000)

## 🔗 Blockchain Integration

### Copyright Protection

The platform uses real blockchain technology for copyright protection:

1. **Connect MetaMask** to Polygon Amoy testnet
2. **Select an article** you want to protect
3. **Register copyright** - pays 0.001 MATIC gas fee
4. **Get permanent proof** - verifiable on Polygonscan

### Network Details

- **Chain**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **RPC**: https://rpc-amoy.polygon.technology/
- **Explorer**: https://amoy.polygonscan.com/
- **Faucet**: https://faucet.polygon.technology/

### Verify Copyright Online

Visit: `https://amoy.polygonscan.com/address/0xeAeE2316D793068c34EbC322e1F8a98dCBAF9f69`

## 📱 Usage

### For Writers

1. **Sign up** with email or Google
2. **Write articles** using the rich text editor
3. **Publish content** with tags for discovery
4. **Protect copyright** via blockchain registration
5. **Track analytics** in the dashboard

### For Readers

1. **Browse articles** on the explore page
2. **Search by tags** or keywords
3. **Read engaging content** from verified writers
4. **Interact** through comments

## 🚀 Deployment

### Vercel Deployment

1. **Connect your GitHub repo** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - platform works immediately with real blockchain features

### Environment Variables for Production

Update `NEXTAUTH_URL` to your production domain:

```env
NEXTAUTH_URL=https://your-app.vercel.app
```

## 🔒 Security Features

- **Secure authentication** with password hashing
- **Session management** with NextAuth
- **Input validation** and sanitization
- **Rate limiting** for API endpoints
- **MongoDB injection protection**
- **Blockchain transaction validation**

## 🎯 Production Ready

- ✅ **Real blockchain integration** (not demo)
- ✅ **Production database** with MongoDB
- ✅ **Secure authentication** system
- ✅ **Error handling** and validation
- ✅ **Performance optimized** for Vercel
- ✅ **Mobile responsive** design
- ✅ **SEO optimized** with proper meta tags

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live Demo**: [Deploy on Vercel]
- **Blockchain Explorer**: [Polygon Amoy Scan](https://amoy.polygonscan.com/)
- **Documentation**: [Next.js Docs](https://nextjs.org/docs)

---

**Built with ❤️ using Next.js, Polygon, and modern web technologies.**
