export interface ChainConfig {
  name: string;
  chainId: number;
  type: 'EVM' | 'SOLANA' | 'BITCOIN';
  provider: 'INFURA' | 'ALCHEMY' | 'CUSTOM';
  network: string;
  symbol: string;
}

// Helper function to build RPC URLs from API keys
export function getRpcUrl(chain: ChainConfig): string {
  const infuraKey = process.env.INFURA_API_KEY;
  const alchemyKey = process.env.ALCHEMY_API_KEY;

  switch (chain.provider) {
    case 'INFURA':
      if (!infuraKey) {
        throw new Error(`Infura API key required for ${chain.name}`);
      }
      return `https://${chain.network}.infura.io/v3/${infuraKey}`;
    
    case 'ALCHEMY':
      if (!alchemyKey) {
        throw new Error(`Alchemy API key required for ${chain.name}`);
      }
      return `https://${chain.network}.g.alchemy.com/v2/${alchemyKey}`;
    
    case 'CUSTOM':
      // For chains that need custom endpoints (like Bitcoin)
      return chain.network;
    
    default:
      throw new Error(`Unknown provider: ${chain.provider}`);
  }
}

export const chains: ChainConfig[] = [
  {
    name: 'Ethereum',
    chainId: 1,
    type: 'EVM',
    provider: 'INFURA',
    network: 'mainnet',
    symbol: 'ETH'
  },
  {
    name: 'BNB Smart Chain',
    chainId: 56,
    type: 'EVM',
    provider: 'INFURA',
    network: 'bsc-mainnet',
    symbol: 'BNB'
  },
  {
    name: 'Polygon',
    chainId: 137,
    type: 'EVM',
    provider: 'INFURA',
    network: 'polygon-mainnet',
    symbol: 'MATIC'
  },
  {
    name: 'Arbitrum',
    chainId: 42161,
    type: 'EVM',
    provider: 'INFURA',
    network: 'arbitrum-mainnet',
    symbol: 'ETH'
  },
  {
    name: 'Optimism',
    chainId: 10,
    type: 'EVM',
    provider: 'INFURA',
    network: 'optimism-mainnet',
    symbol: 'ETH'
  },
  {
    name: 'Avalanche',
    chainId: 43114,
    type: 'EVM',
    provider: 'INFURA',
    network: 'avalanche-mainnet',
    symbol: 'AVAX'
  },
  {
    name: 'Solana',
    chainId: 101,
    type: 'SOLANA',
    provider: 'ALCHEMY',
    network: 'solana-mainnet',
    symbol: 'SOL'
  },
  {
    name: 'Bitcoin',
    chainId: 0,
    type: 'BITCOIN',
    provider: 'CUSTOM',
    network: 'https://mempool.space/api/v1/fees/recommended',
    symbol: 'BTC'
  }
]; 