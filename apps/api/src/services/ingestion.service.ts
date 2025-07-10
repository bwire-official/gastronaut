import axios from 'axios';
import pool from '../lib/db';
import { chains, ChainConfig, getRpcUrl } from '../config/chains';

interface GasPriceData {
  timestamp: Date;
  chain_id: number;
  price_slow: number;
  price_average: number;
  price_fast: number;
}

// Helper function for EVM chains
async function getEvmGasPrice(chainConfig: ChainConfig): Promise<GasPriceData> {
  try {
    const rpcUrl = getRpcUrl(chainConfig);
    const response = await axios.post(rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_gasPrice',
      params: [],
      id: 1
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    const gasPrice = parseInt(response.data.result, 16);
    const gasPriceGwei = gasPrice / 1e9;

    // For EVM chains, we'll use the same price for all tiers initially
    // In a production environment, you'd want to get more granular data
    return {
      timestamp: new Date(),
      chain_id: chainConfig.chainId,
      price_slow: gasPriceGwei * 0.8,
      price_average: gasPriceGwei,
      price_fast: gasPriceGwei * 1.2
    };
  } catch (error) {
    console.error(`Error fetching gas price for ${chainConfig.name}:`, error);
    throw error;
  }
}

// Helper function for Solana
async function getSolanaFee(chainConfig: ChainConfig): Promise<GasPriceData> {
  try {
    const rpcUrl = getRpcUrl(chainConfig);
    const response = await axios.post(rpcUrl, {
      jsonrpc: '2.0',
      method: 'getRecentPrioritizationFees',
      params: [['11111111111111111111111111111111']], // System program
      id: 1
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    const fees = response.data.result;
    const avgFee = fees.length > 0 ? fees.reduce((sum: number, fee: any) => sum + fee.prioritizationFee, 0) / fees.length : 0;
    
    // Convert to a reasonable range for display
    const feeInGwei = avgFee / 1000; // Rough conversion

    return {
      timestamp: new Date(),
      chain_id: chainConfig.chainId,
      price_slow: feeInGwei * 0.8,
      price_average: feeInGwei,
      price_fast: feeInGwei * 1.2
    };
  } catch (error) {
    console.error(`Error fetching fee for ${chainConfig.name}:`, error);
    throw error;
  }
}

// Helper function for Bitcoin
async function getBitcoinFee(chainConfig: ChainConfig): Promise<GasPriceData> {
  try {
    const response = await axios.get('https://mempool.space/api/v1/fees/recommended', {
      timeout: 10000
    });

    const { fastestFee, halfHourFee, hourFee } = response.data;
    
    // Convert sat/vB to Gwei equivalent for consistency with other chains
    // 1 sat/vB ≈ 0.1 Gwei equivalent for display purposes
    const fastFeeGwei = fastestFee * 0.1;
    const averageFeeGwei = halfHourFee * 0.1;
    const slowFeeGwei = hourFee * 0.1;

    return {
      timestamp: new Date(),
      chain_id: chainConfig.chainId,
      price_slow: slowFeeGwei,
      price_average: averageFeeGwei,
      price_fast: fastFeeGwei
    };
  } catch (error) {
    console.error(`Error fetching fee for ${chainConfig.name}:`, error);
    throw error;
  }
}

// Main service function
export async function startIngestionService(): Promise<void> {
  console.log('🚀 Starting GAStronaut Data Ingestion Service...');
  
  while (true) {
    try {
      console.log(`📊 Fetching gas prices at ${new Date().toISOString()}`);
      
      // Fetch data for all chains in parallel
      const dataPromises = chains.map(async (chain) => {
        try {
          switch (chain.type) {
            case 'EVM':
              return await getEvmGasPrice(chain);
            case 'SOLANA':
              return await getSolanaFee(chain);
            case 'BITCOIN':
              return await getBitcoinFee(chain);
            default:
              throw new Error(`Unknown chain type: ${chain.type}`);
          }
        } catch (error) {
          console.error(`Failed to fetch data for ${chain.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(dataPromises);
      const validData = results.filter(data => data !== null) as GasPriceData[];

      if (validData.length > 0) {
        // Construct SQL INSERT statement
        const values = validData.map((data, index) => {
          const offset = index * 5;
          return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
        }).join(', ');

        const query = `
          INSERT INTO gas_prices (timestamp, chain_id, price_slow, price_average, price_fast)
          VALUES ${values}
          ON CONFLICT (timestamp, chain_id) DO UPDATE SET
            price_slow = EXCLUDED.price_slow,
            price_average = EXCLUDED.price_average,
            price_fast = EXCLUDED.price_fast
        `;

        const flatValues = validData.flatMap(data => [
          data.timestamp,
          data.chain_id,
          data.price_slow,
          data.price_average,
          data.price_fast
        ]);

        await pool.query(query, flatValues);
        console.log(`✅ Successfully stored ${validData.length} gas price records`);
      } else {
        console.warn('⚠️ No valid data to store');
      }

    } catch (error) {
      console.error('❌ Error in ingestion loop:', error);
    }

    // Wait 60 seconds before next iteration
    console.log('⏳ Waiting 60 seconds before next fetch...');
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
} 