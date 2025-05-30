import { BitkubSDK } from '../src/index';
import axios from 'axios';
import { MarketSymbols } from '../src/types/market';

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
});