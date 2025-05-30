export interface MarketSymbolResponse {
  id: number;
  symbol: string; // e.g., "THB_ETH"
  info: string;
}

export type MarketSymbols = Record<string, MarketSymbolResponse>

export type OrderBookEntry = [
  string, // order id
  number, // timestamp
  number, // volume
  number, // rate
  number  // amount
];

export interface OrderBookResult {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface OrderBookResponse {
  error: number;
  result: OrderBookResult;
}