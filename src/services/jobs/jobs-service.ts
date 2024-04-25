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

  static async getJobById(id: number, companyId: number, token: string) {
    const url = `${apiUrl}/getJobById`;
    const vars = {
      id: id,
      companyId: companyId
    };
    const body = (await axios.post(url, vars, { headers: { 'x-jwt': token } })).data as any;

    return body;
  }

  static async deleteJobById(id: number, token: string) {
    const url = `${apiUrl}/deleteJobById`;
    await axios.delete(url, { headers: { 'x-jwt': token }, data: { id: id } });
  }

  static async createJob(
    id: number,
    companyId: number,
    jobStageId: number,
    name: string,
    description: string,
    termsAndConditions: string,
    privacyNotice: string,
    questions: string,
    token: string
  ) {
    const url = `${apiUrl}/createJob`;
    const vars = {
      id: id,
      companyId: companyId,
      jobStageId: jobStageId,
      name: name,
      description: description,
      termsAndConditions: termsAndConditions,
      privacyNotice: privacyNotice,
      questions: questions
    };
    await axios.put(url, vars, { headers: { 'x-jwt': token } });
  }

  static async updateJob(
    id: number,
    companyId: number,
    jobStageId: number,
    name: string,
    description: string,
    termsAndConditions: string,
    privacyNotice: string,
    questions: string,
    token: string
  ) {
    const url = `${apiUrl}/updateJob`;
    const vars = {
      id: id,
      companyId: companyId,
      jobStageId: jobStageId,
      name: name,
      description: description,
      termsAndConditions: termsAndConditions,
      privacyNotice: privacyNotice,
      questions: questions
    };
    await axios.put(url, vars, { headers: { 'x-jwt': token } });
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
