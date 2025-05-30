import { BitkubSDK } from '../src/index';
import axios from 'axios';
import { MarketSymbols } from '../src/types/output.type';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BitkubSDK', () => {
  it('should instantiate with default config', () => {
    const sdk = new BitkubSDK();
    expect(sdk).toBeInstanceOf(BitkubSDK);
  });

  describe('fetchMarketSymbols', () => {
    it('should fetch and transform market symbols', async () => {
      const mockApiResponse = {
        error: 0,
        result: [
          { id: 1, symbol: 'THB_BTC', info: 'Thai Baht to Bitcoin' },
          { id: 2, symbol: 'THB_ETH', info: 'Thai Baht to Ethereum' },
        ],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });

      const sdk = new BitkubSDK();
      const result = await sdk.fetchMarketSymbols();

      const expected: MarketSymbols = {
        BTC_THB: { id: 1, symbol: 'BTC_THB', info: 'Thai Baht to Bitcoin' },
        ETH_THB: { id: 2, symbol: 'ETH_THB', info: 'Thai Baht to Ethereum' },
      };
      expect(result).toEqual(expected);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.bitkub.com/api/market/symbols');
    });

    it('should throw an error if the request fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      const sdk = new BitkubSDK();
      await expect(sdk.fetchMarketSymbols()).rejects.toThrow('Failed to fetch market symbols');
    });
  });

  describe('fetchOrderBooks', () => {
    it('should fetch order book for a single symbol', async () => {
      const mockApiResponse = {
        error: 0,
        result: {
          bids: [["1", 1529453033, 997.5, 10000, 0.09975]],
          asks: [["680", 1529491094, 997.5, 10000, 0.09975]],
        },
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });
      const sdk = new BitkubSDK();
      const result = await sdk.fetchOrderBooks(["BTC_THB"]);
      expect(result).toEqual({
        BTC_THB: {
          bids: [{ price: 10000, amount: 0.09975 }],
          asks: [{ price: 10000, amount: 0.09975 }],
        },
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.bitkub.com/api/market/books',
        { params: { sym: 'thb_btc' } }
      );
    });

    it('should fetch order books for multiple symbols', async () => {
      const mockApiResponse1 = {
        error: 0,
        result: {
          bids: [["2", 1529453034, 500, 20000, 0.025]],
          asks: [["681", 1529491095, 500, 20000, 0.025]],
        },
      };
      const mockApiResponse2 = {
        error: 0,
        result: {
          bids: [["3", 1529453035, 250, 30000, 0.00833]],
          asks: [["682", 1529491096, 250, 30000, 0.00833]],
        },
      };
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockApiResponse1 })
        .mockResolvedValueOnce({ data: mockApiResponse2 });
      const sdk = new BitkubSDK();
      const result = await sdk.fetchOrderBooks(["BTC_THB", "ETH_THB"]);
      expect(result).toEqual({
        BTC_THB: {
          bids: [{ price: 20000, amount: 0.025 }],
          asks: [{ price: 20000, amount: 0.025 }],
        },
        ETH_THB: {
          bids: [{ price: 30000, amount: 0.00833 }],
          asks: [{ price: 30000, amount: 0.00833 }],
        },
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.bitkub.com/api/market/books',
        { params: { sym: 'thb_btc' } }
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.bitkub.com/api/market/books',
        { params: { sym: 'thb_eth' } }
      );
    });

    it('should throw an error if the API returns an error for a symbol', async () => {
      const mockApiResponse = { error: 1, result: { bids: [], asks: [] } };
      mockedAxios.get.mockResolvedValueOnce({ data: mockApiResponse });
      const sdk = new BitkubSDK();
      await expect(sdk.fetchOrderBooks(["BTC_THB"])).rejects.toThrow('API error for BTC_THB: 1');
    });
  });
});