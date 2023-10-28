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

export interface Company {
  id: number;
  countryId: number;
  currencyId: number;
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
  companies: [Company];
}
