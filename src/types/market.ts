export interface MarketSymbolResponse {
  id: number;
  symbol: string; // e.g., "THB_ETH"
  info: string;
}

export type MarketSymbols = Record<string, MarketSymbolResponse>