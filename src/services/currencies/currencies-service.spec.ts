import axios from 'axios';
import CountriesService from './currencies-service';

jest.mock('axios');

describe('Currencies service tests', () => {
  test('getCurrencies', async () => {
    const currencies = [{ id: 1, name: 'Currency1', symbol: 'Currency1', symbolName: 'Currency1' }];
    const resp = { currencies };
    (axios.get as jest.Mock).mockResolvedValue(resp);

    const result = await CountriesService.getCurrencies();
    expect(result).toEqual(currencies);
  });
});
