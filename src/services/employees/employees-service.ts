import axios, { AxiosResponse } from 'axios';
import { IInputSignIn, IEmployee, IEmployeeSearch } from 'src/__typedefs/graphqlTypes';
import config from '../../config';

const apiUrl = config.employeesService.url;

export default class EmployeesService {
  static async signIn(input: IInputSignIn) {
    const url = `${apiUrl}/signIn`;
    const vars = { email: input.email, password: input.password };
    const body = ((await axios.post(url, vars)) as AxiosResponse).data.employee as IEmployee;

    return body;
  }

  static async signInBackOffice(input: IInputSignIn) {
    const url = `${apiUrl}/signInBackOffice`;
    const vars = { email: input.email, password: input.password };
    const body = ((await axios.post(url, vars)) as AxiosResponse).data.employee as IEmployee;

    return body;
  }

  static async activateEmployeeAccount(id: number) {
    const url = `${apiUrl}/activateEmployeeAccount`;
    const vars = { id: id };
    const body = ((await axios.post(url, vars)) as AxiosResponse).data;

    return body;
  }

  static async getEmployees(input: IEmployeeSearch, token: string) {
    const url = `${apiUrl}/getEmployees`;
    const vars = {
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
      companyId: input.companyId,
      name: input.name
    };
    const body = (await axios.post(url, vars, { headers: { 'x-jwt': token } })) as AxiosResponse;

    return body;
  }

  static async getEmployeeById(id: number, companyId: number, token: string) {
    const url = `${apiUrl}/getEmployeeById`;
    const vars = {
      id: id,
      companyId: companyId
    };
    const body = (await axios.post(url, vars, { headers: { 'x-jwt': token } })).data as any;

    return body;
  }
  static async getEmployeesByDepartmentAndLocation(input: IEmployeeSearch, token: string) {
    const url = `${apiUrl}/getEmployeesByDepartmentAndLocation`;
    const vars = {
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
      departmentId: input.departmentId,
      locationId: input.locationId
    };
    const response = (await axios.post(url, vars, { headers: { 'x-jwt': token } })) as AxiosResponse;

    return response;
  }
}
