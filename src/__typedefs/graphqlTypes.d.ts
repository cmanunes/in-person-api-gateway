// used for sign in
export interface IInputSignIn {
  email: string;
  password: string;
}

export interface IInputSignUp {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  packageId: number;
  paymentType: string;
  countryId: number;
  currencyId: number;
}

export interface IPackage {
  id: number;
  name: string;
}

export interface IEmployee {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  isBackOffice: boolean;
  dateOfBirth: string;
}

export interface ICompany {
  id: number;
  countryId: number;
  countryName?: string;
  currencyId: number;
  currencyName?: string;
  name: string;
  vatNumber: string;
  registeredNumber: string;
  registeredFieldName: string;
  isActive: boolean;
  isBackOffice: boolean;
}

export interface ICompanySearch {
  pageNumber: number;
  pageSize: number;
  name: string;
  isBackOffice: boolean;
}

export interface GetCompaniesResponse {
  total: number;
  companies: [ICompany];
}

export interface IDepartment {
  id: number;
  companyId: number;
  managerId?: number;
  name: string;
  email?: string;
}

export interface IDepartmentSearch {
  pageNumber: number;
  pageSize: number;
  companyId: number;
}

export interface GetDepartmentsResponse {
  departements: [IDepartment];
}

export interface ILocation {
  id: number;
  companyId: number;
  countryId: number;
  managerId?: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
}

export interface ILocationSearch {
  pageNumber: number;
  pageSize: number;
  companyId: number;
  countryId: number;
}

export interface GetLocationsResponse {
  locations: [ILocation];
}

export interface IEmployeeSearch {
  pageNumber: number;
  pageSize: number;
  departmentId: number;
  locationId: number;
}

export interface IJobSearch {
  pageNumber: number;
  pageSize: number;
  name: string;
  jobStageId: number;
  companyId: number;
}

export interface IJob {
  id: number;
  companyId: number;
  name: string;
}

export interface GetJobsResponse {
  total: number;
  jobs: [IJob];
}
