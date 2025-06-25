# Quilly - Modern Content Publishing Platform

A distraction-free writing platform that prioritizes quality over quantity, built with Next.js and blockchain integration.

## ✨ Features

### 🔐 Authentication & User Management

- Email/password authentication with OTP verification
- Google OAuth integration
- Role-based access (Reader/Writer)
- Secure password requirements and account locking

### ✍️ Content Creation & Management

- Rich text editor with formatting toolbar (desktop)
- Simple textarea interface (mobile)
- Auto-save functionality
- Tags system with popular tags discovery
- Article search and filtering
- Real-time preview mode

### 🌐 Content Discovery

- Explore page with trending articles
- Tag-based filtering and search
- Article analytics and engagement metrics
- Comment system

### 📊 Analytics Dashboard

- Writer analytics: views, reads, engagement rates
- Reader dashboard: reading stats and recommendations
- Performance metrics and trends
- Word count and content statistics

### ⛓️ Blockchain Integration

- Token-based tipping system (QUILL tokens)
- Copyright protection for articles
- DAO governance for platform decisions
- MetaMask wallet integration
- Polygon testnet deployment

## 🛠️ Tech Stack

### Frontend

- **Next.js 13.5.1** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend

- **NextAuth.js** - Authentication
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **Resend** - Email service

### Blockchain

- **Ethers.js** - Web3 integration
- **Hardhat** - Smart contract development
- **Solidity** - Smart contracts
- **Polygon Amoy** - Testnet deployment

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd contentplatform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_CLIENT_ID=your_google_oauth_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_secret
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Visit the application**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
contentplatform/
├── app/                    # Next.js app directory
│   ├── (main)/            # Main application pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── components/        # Page-specific components
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── blockchain/       # Web3 components
│   └── mockups/          # Demo components
├── contracts/            # Solidity smart contracts
├── lib/                  # Utility libraries
├── models/               # Database models
├── hooks/                # Custom React hooks
└── types/                # TypeScript definitions
```

## 🔑 Key Features Explained

### Authentication Flow

1. User signs up with email/password or Google OAuth
2. Email verification via OTP
3. Role selection (Reader/Writer)
4. Access to appropriate dashboard and features

### Article Creation

- Writers can create articles using rich text editor
- Auto-save prevents data loss
- Tag system for content categorization
- Preview mode for content review

### Blockchain Features

- Connect MetaMask wallet
- Claim QUILL tokens from faucet
- Tip writers with tokens
- Register article copyright
- Participate in DAO governance

## 📊 Database Schema

### User Model

- Email, name, bio, role
- Authentication metadata
- Role-based permissions

### Article Model

- Title, content, author information
- Tags array (max 10)
- Creation timestamp
- Search indexing

## 🔧 Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Blockchain Development

```bash
npx hardhat compile
npx hardhat test
npx hardhat deploy --network polygonAmoy
```

## 🌐 Deployment

The application is configured for Vercel deployment:

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

---
