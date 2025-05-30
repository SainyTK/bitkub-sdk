import axios from 'axios';
import { MarketSymbols, OrderBook } from './types/output.type';
import { MarketSymbolResponse, OrderBookResponse, ResponseOrderBookEntry } from './types/response.type';

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

  async fetchOrderBooks(syms: string[], lmt?: number): Promise<Record<string, OrderBook>> {
    try {
      const results = await Promise.all(
        syms.map(async (sym) => {
          const apiSym = this.transformSymbol(sym);
          const params: { sym: string; lmt?: number } = { sym: apiSym };
          if (lmt !== undefined) params.lmt = lmt;
          const response = await axios.get<OrderBookResponse>(`${this.baseUrl}/api/market/books`, { params });
          if (response.data.error !== 0) {
            throw new Error(`API error for ${sym}: ${response.data.error}`);
          }
          // Transform bids and asks
          const { bids, asks } = response.data.result;
          const transform = (entries: ResponseOrderBookEntry[]) =>
            entries.map((entry) => ({ price: entry[3], amount: entry[4] }));
          return [sym, { bids: transform(bids), asks: transform(asks) }] as const;
        })
      );
      return Object.fromEntries(results);
    } catch (error) {
      throw new Error(`Failed to fetch order books: ${error}`);
    }
  }

  private transformSymbol(sym: string): string {
    const [base, quote] = sym.split('_');
    return `${quote.toLowerCase()}_${base.toLowerCase()}`;
  }
} 