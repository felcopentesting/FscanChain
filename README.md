# FscanChain - Advanced Blockchain Explorer

FscanChain is a robust, decentralized blockchain explorer built with modern web technologies, offering enhanced features and hardened infrastructure compared to traditional explorers.

##  Features

### Core Functionality
- **Real-time Blockchain Data**: Live blocks, transactions, and network statistics
- **Advanced Search**: Multi-type search across blocks, transactions, addresses, and tokens
- **Comprehensive Analytics**: Gas price trends, transaction volume, and network metrics
- **Token Support**: ERC-20, ERC-721, and ERC-1155 token tracking

### Enhanced Features
- **User Watchlists**: Track addresses and tokens of interest
- **Smart Alerts**: Custom notifications for address activity, whale movements, and more
- **Annotations**: Add private or public notes to addresses and transactions
- **API Access**: RESTful API with rate limiting and usage tracking
- **Advanced Filtering**: Filter by contract type, verification status, and more

### Security & Infrastructure
- **Decentralized Architecture**: Built on Convex for real-time, distributed data
- **Rate Limiting**: Built-in API protection and usage monitoring
- **Authentication**: Secure user accounts with Convex Auth
- **Data Integrity**: Comprehensive validation and error handling

##  Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database and functions)
- **Authentication**: Convex Auth
- **Search**: Full-text search with advanced indexing
- **API**: RESTful endpoints with automatic rate limiting

##  Data Models

### Blockchain Data
- **Blocks**: Complete block information with gas metrics
- **Transactions**: Full transaction details with logs and traces
- **Addresses**: Balance tracking, contract detection, and labeling
- **Tokens**: ERC standard support with metadata and holder tracking

### User Features
- **Watchlists**: Customizable address and token monitoring
- **Alerts**: Configurable notifications with threshold settings
- **Annotations**: User-generated content and tagging system
- **API Keys**: Secure API access with usage analytics

##  API Endpoints

### Public API
- `GET /api/v1/block/:number` - Get block by number
- `GET /api/v1/tx/:hash` - Get transaction by hash
- `GET /api/v1/address/:address` - Get address information
- `GET /api/v1/address/:address/txs` - Get address transactions
- `GET /api/v1/token/:address` - Get token information
- `GET /api/v1/stats` - Get network statistics
- `GET /api/v1/search` - Multi-type search

### Webhook Support
- `POST /webhook/block` - Blockchain data ingestion

##  Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/felcopentesting/FscanChain.git
   cd fscan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Environment Variables

Set up the following environment variables in your Convex deployment:

- `BLOCKCHAIN_RPC_URL` - Ethereum node RPC endpoint
- `WEBHOOK_SECRET` - Secret for validating blockchain webhooks
- `API_RATE_LIMIT` - Default API rate limit per hour

## Roadmap

### Phase 1: Core Features 
- Basic blockchain explorer functionality
- Real-time data synchronization
- Search and filtering capabilities

### Phase 2: Enhanced Analytics 
- Advanced charting and visualizations
- DeFi protocol integration
- MEV detection and analysis

### Phase 3: Decentralization 
- IPFS integration for data redundancy
- Distributed node network
- Governance token and DAO structure

### Phase 4: Advanced Features 
- Smart contract interaction interface
- Portfolio tracking and management
- Cross-chain support

##  Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Links

- **Website**: TBA
- **API Documentation**: TBA
- **GitHub**: Current
- **Discord**: TBA

##  Acknowledgments

- Built with [Convex](https://convex.dev) for real-time backend infrastructure
- Inspired by Etherscan's pioneering work in blockchain exploration
- Thanks to the open-source community for various tools and libraries

---

**Fscan** - Exploring the blockchain with enhanced features and decentralized infrastructure.
