import axios, { AxiosResponse } from 'axios';
import { IJobSearch } from '../../__typedefs/graphqlTypes';
import config from '../../config';

const apiUrl = config.jobsService.url;

export default class JobsService {
  static async getJobStages(token: string) {
    const url = `${apiUrl}/getJobStages`;
    const body = (await axios.get(url, { headers: { 'x-jwt': token } })).data as any;

    return body;
  }

  static async getJobs(input: IJobSearch, token: string) {
    const url = `${apiUrl}/getJobs`;
    const vars = {
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
      name: input.name,
      jobStageId: input.jobStageId,
      companyId: input.companyId
    };
    const body = (await axios.post(url, vars, { headers: { 'x-jwt': token } })).data as any;

    return body;
  }
}
