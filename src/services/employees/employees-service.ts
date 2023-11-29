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

  static async activateEmployeeAccount(id: number) {
    const url = `${apiUrl}/activateEmployeeAccount`;
    const vars = { id: id };
    const body = ((await axios.post(url, vars)) as AxiosResponse).data;

    return body;
  }

  static async getEmployeesByDepartmentAndLocation(input: IEmployeeSearch) {
    const url = `${apiUrl}/getEmployeesByDepartmentAndLocation`;
    const vars = {
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
      departmentId: input.departmentId,
      locationId: input.locationId
    };
    const body = ((await axios.post(url, vars)) as AxiosResponse).data;

    return body;
  }
}
