export interface MarketSymbolResponse {
  id: number;
  symbol: string; // e.g., "THB_ETH"
  info: string;
}

export type ResponseOrderBookEntry = [
  string, // order id
  number, // timestamp
  number, // volume
  number, // rate
  number, // amount
];

export interface ResponseOrderBookResult {
  bids: ResponseOrderBookEntry[];
  asks: ResponseOrderBookEntry[];
}

export interface OrderBookResponse {
  error: number;
  result: ResponseOrderBookResult;
}
