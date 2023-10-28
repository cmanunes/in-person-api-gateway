import axios from 'axios';
import PackagesService from './packages-service';

jest.mock('axios');

describe('Packages service tests', () => {
  test('getPackages', async () => {
    const packages = [{ id: 1, name: 'Pacakge1' }];
    const resp = { packages };
    (axios.get as jest.Mock).mockResolvedValue(resp);

    const result = await PackagesService.getPackages();
    expect(result).toEqual(packages);
  });
});
