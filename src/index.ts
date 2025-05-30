import axios from 'axios';
import { MarketSymbolResponse, MarketSymbols } from './types/market';

export interface BitkubSDKConfig {
  baseUrl?: string;
  baseWsUrl?: string;
  apiKey?: string;
  apiSecret?: string;
}

export class BitkubSDK {
  private readonly baseUrl: string;
  private readonly baseWsUrl: string;
  private readonly apiKey?: string;
  private readonly apiSecret?: string;

  constructor(config: BitkubSDKConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://api.bitkub.com';
    this.baseWsUrl = config.baseWsUrl || 'wss://api.bitkub.com/websocket-api';
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
  }

  async fetchMarketSymbols(): Promise<MarketSymbols> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/market/symbols`);
      const rawSymbols: MarketSymbolResponse[] = response.data.result;

      const transformed: MarketSymbols = {};
      for (const item of rawSymbols) {
        const [base, quote] = item.symbol.split('_');
        const swappedSymbol = `${quote}_${base}`;
        transformed[swappedSymbol] = {
          ...item,
          symbol: swappedSymbol,
        };
      }
      return transformed;
    } catch (error) {
      throw new Error(`Failed to fetch market symbols: ${error}`);
    }
  }
} 