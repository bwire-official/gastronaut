# GAStronaut 🚀

**Smart Gas Fee Assistant for Crypto Users**

GAStronaut is a comprehensive gas fee monitoring and intelligence platform that helps crypto users save time and money by making intelligent, data-driven decisions about their on-chain transactions.

## 🎯 Mission

Our mission is to empower all crypto users to save time and money by making intelligent, data-driven decisions about their on-chain transactions. We do this by providing a smart, intuitive, and personalized gas fee assistant.

**Core Principle**: *"Anonymous by Default, Powerful by Choice."* Users receive immediate value without providing any personal data, and can optionally provide more information to unlock hyper-personalized features.

## 🏗️ Architecture

This is a **monorepo** built with Turborepo, featuring a decoupled, service-oriented architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Service   │    │  Data Ingestion │
│  (Next.js App)  │◄──►│   (Express)     │◄──►│   (Background)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │  (TimescaleDB)  │
                       └─────────────────┘
```

## 📦 What's Inside

### Apps
- **`mini-app`**: Next.js frontend application (Telegram Mini App)
- **`api`**: Express.js backend API service
- **`docs`**: Documentation site

### Packages
- **`@repo/ui`**: Shared React component library
- **`@repo/eslint-config`**: ESLint configurations
- **`@repo/typescript-config`**: TypeScript configurations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (with TimescaleDB extension recommended)
- Infura API key
- Alchemy API key

### 1. Clone and Install
```bash
git clone <repository-url>
cd gastronaut
npm install
```

### 2. Environment Setup
Create `.env` files in the following locations:

**`apps/api/.env`**:
```env
DATABASE_URL=your_postgresql_connection_string
INFURA_API_KEY=your_infura_project_id
ALCHEMY_API_KEY=your_alchemy_api_key
```

### 3. Database Setup
Create the required database table:
```sql
CREATE TABLE gas_prices (
    timestamp TIMESTAMPTZ NOT NULL,
    chain_id INTEGER NOT NULL,
    price_slow NUMERIC(10,2),
    price_average NUMERIC(10,2),
    price_fast NUMERIC(10,2),
    PRIMARY KEY (timestamp, chain_id)
);
```

### 4. Start Development
```bash
# Start all services
npm run dev

# Or start specific services
npm run dev --filter=api
npm run dev --filter=mini-app
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run lint` - Lint all code
- `npm run type-check` - Type check all TypeScript

### API Endpoints
- `GET /api/gas/now` - Get latest gas prices for all chains
- `GET /` - API health check

### Supported Blockchains
- Ethereum (ETH)
- BNB Smart Chain (BNB)
- Polygon (MATIC)
- Arbitrum
- Optimism
- Avalanche (AVAX)
- Solana (SOL)
- Bitcoin (BTC)

## 🏛️ Project Structure

```
gastronaut/
├── apps/
│   ├── api/                 # Backend API service
│   │   ├── src/
│   │   │   ├── config/      # Blockchain configurations
│   │   │   ├── lib/         # Database connection
│   │   │   ├── routes/      # API routes
│   │   │   └── services/    # Data ingestion service
│   │   └── .env            # API environment variables
│   ├── mini-app/           # Frontend application
│   │   ├── app/            # Next.js app directory
│   │   └── .env.local      # Frontend environment variables
│   └── docs/               # Documentation site
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── eslint-config/      # ESLint configurations
│   └── typescript-config/  # TypeScript configurations
└── turbo.json             # Turborepo configuration
```

## 🎨 Features

### Current Features
- ✅ Real-time gas price monitoring across 8 major blockchains
- ✅ Professional infrastructure (Infura/Alchemy) for reliable data
- ✅ RESTful API with CORS support
- ✅ Background data ingestion service
- ✅ Interactive web interface
- ✅ TypeScript throughout the stack

### Planned Features
- 🔄 Historical gas price charts
- 🔄 Gas price alerts and notifications
- 🔄 Predictive gas forecasting
- 🔄 Personalized insights
- 🔄 Wallet integration
- 🔄 Telegram bot integration

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Monorepo** | Turborepo | Efficient multi-app management |
| **Frontend** | Next.js + React | Modern, fast web application |
| **Backend** | Express.js + TypeScript | High-performance API |
| **Database** | PostgreSQL + TimescaleDB | Time-series data storage |
| **Infrastructure** | Infura + Alchemy | Professional blockchain access |
| **Deployment** | Vercel + Render | Scalable cloud hosting |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs` app for detailed guides
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join the conversation in GitHub Discussions

---

**Built with ❤️ for the crypto community**
