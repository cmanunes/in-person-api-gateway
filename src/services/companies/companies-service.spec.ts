import axios from 'axios';
import { IInputSignUp } from '../../__typedefs/graphqlTypes';
import CompaniesService from './companies-service';

jest.mock('axios');

describe('Companies service tests', () => {
  test('signIn', async () => {
    const input: IInputSignUp = {
      companyName: 'aaa',
      firstName: 'first',
      lastName: 'last',
      email: 'email',
      password: 'password',
      packageId: 1,
      paymentType: 'M',
      countryId: 1,
      currencyId: 1
    };

    const users = [{ name: 'Bob' }];
    const resp = { users };
    (axios.get as jest.Mock).mockResolvedValue(resp);

    const result = await CompaniesService.signUp(input);
    expect(result).toEqual(users);
  });
});
