import axios from 'axios';
import { IInputSignUp, IJobSearch } from '../../__typedefs/graphqlTypes';
import JobsService from './jobs-service';

jest.mock('axios');

describe('Companies service tests', () => {
  test('signIn', async () => {
    const input: IJobSearch = {
      pageNumber: 1,
      pageSize: 25,
      name: 'aa',
      jobStageId: 1,
      companyId: 1
    };

    const jobs = [{ name: 'Job' }];
    const resp = { jobs };
    (axios.get as jest.Mock).mockResolvedValue(resp);

    const result = await JobsService.getJobs(input, 'aa');
    expect(result).toEqual(jobs);
  });
});
