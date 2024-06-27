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

  static async updateEmployee(
    id: number,
    companyId: number,
    locationId: number,
    departmentId: number,
    currencyId: number,
    managerId: number,
    teamId: number,
    profileId: number,
    employmentTypeId: number,
    employeeStatusId: number,
    employeeId: string,
    title: string,
    firstName: string,
    middleNames: string,
    lastName: string,
    dateOfBirth: string,
    email: string,
    maritalStatus: string,
    password: string,
    contact: string,
    emergencyContact: string,
    experienceTime: number,
    skills: string,
    userMonthlyCost: string,
    userYearlyCost: string,
    paymentType: string,
    startingDate: string,
    finishingDate: string,
    probationStartDate: string,
    probationEndDate: string,
    createdDate: string,
    updatedDate: string,
    isBackOffice: boolean,
    isActive: boolean,
    token: string
  ) {
    const url = `${apiUrl}/updateEmployee`;
    const vars = {
      id: id,
      companyId: companyId,
      locationId: locationId,
      departmentId: departmentId,
      currencyId: currencyId,
      managerId: managerId,
      teamId: teamId,
      profileId: profileId,
      employmentTypeId: employmentTypeId,
      employeeStatusId: employeeStatusId,
      employeeId: employeeId,
      title: title,
      firstName: firstName,
      middleNames: middleNames,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      email: email,
      maritalStatus: maritalStatus,
      password: password,
      contact: contact,
      emergencyContact: emergencyContact,
      experienceTime: experienceTime,
      skills: skills,
      userMonthlyCost: userMonthlyCost,
      userYearlyCost: userYearlyCost,
      paymentType: paymentType,
      startingDate: startingDate,
      finishingDate: finishingDate,
      probationStartDate: probationStartDate,
      probationEndDate: probationEndDate,
      createdDate: createdDate,
      updatedDate: updatedDate,
      isBackOffice: isBackOffice,
      isActive: isActive
    };
    await axios.put(url, vars, { headers: { 'x-jwt': token } });
  }
}
