import { MarketSymbolResponse } from "./response.type";

export type MarketSymbols = Record<string, MarketSymbolResponse>

export interface OrderBookEntry {
  price: number;
  amount: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}
