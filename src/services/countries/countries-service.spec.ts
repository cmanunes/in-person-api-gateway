import axios from 'axios';
import CountriesService from './countries-service';

jest.mock('axios');

describe('Countries service tests', () => {
  test('getCountries', async () => {
    const countries = [{ id: 1, name: 'Country1' }];
    const resp = { countries };
    (axios.get as jest.Mock).mockResolvedValue(resp);

    const result = await CountriesService.getCountries();
    expect(result).toEqual(countries);
  });
});
