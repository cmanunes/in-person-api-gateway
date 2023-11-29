import axios, { AxiosResponse } from 'axios';
import {
  GetCompaniesResponse,
  GetDepartmentsResponse,
  GetLocationsResponse,
  ICompanySearch,
  IDepartmentSearch,
  IInputSignUp,
  ILocationSearch
} from '../../__typedefs/graphqlTypes';
import config from '../../config';

const apiUrl = config.companiesService.url;

export default class CompaniesService {
  static async signUp(input: IInputSignUp): Promise<string> {
    const url = `${apiUrl}/signUp`;
    const vars = {
      companyName: input.companyName,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      packageId: input.packageId,
      paymentType: input.paymentType,
      countryId: input.countryId,
      currencyId: input.currencyId
    };
    const body = ((await axios.post(url, vars)) as AxiosResponse).data as any;

    return body;
  }

  static async getCompanies(input: ICompanySearch): Promise<GetCompaniesResponse> {
    const url = `${apiUrl}/getCompanies`;
    const vars = {
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
      name: input.name,
      isBackOffice: input.isBackOffice
    };
    const body = ((await axios.post(url, vars)) as AxiosResponse).data as any;

    return body;
  }

  static async getDepartments(input: IDepartmentSearch): Promise<GetDepartmentsResponse> {
    const url = `${apiUrl}/getDepartments`;
    const vars = {
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
      companyId: input.companyId
    };
    const body = ((await axios.post(url, vars)) as AxiosResponse).data as any;

    return body;
  }

  static async getLocations(input: ILocationSearch): Promise<GetLocationsResponse> {
    const url = `${apiUrl}/getLocations`;
    const vars = {
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
      companyId: input.companyId,
      countryId: input.countryId
    };
    const body = ((await axios.post(url, vars)) as AxiosResponse).data as any;

    return body;
  }
}
