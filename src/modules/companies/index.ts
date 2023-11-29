import { ForbiddenError, gql } from 'apollo-server-express';
import auth from '../../auth';
import { ICompanySearch, IDepartmentSearch, IInputSignUp, ILocationSearch } from 'src/__typedefs/graphqlTypes';
import CompaniesService from '../../services/companies/companies-service';

const typeDefs = gql`
  input SignUp {
    companyName: String
    firstName: String
    lastName: String
    email: String
    password: String
    packageId: Int
    paymentType: String
    countryId: Int
    currencyId: Int
  }

  type NewToken {
    token: String
  }

  type ProcessCompleted {
    result: String
  }

  type Company {
    id: Int
    countryId: Int
    countryName: String
    currencyId: Int
    currencyName: String
    name: String
    vatNumber: String
    registeredNumber: String
    registeredFieldName: String
    isActive: Boolean
    isBackOffice: Boolean
  }

  type GetCompaniesResponse {
    total: Int
    companies: [Company]
  }

  type Department {
    id: Int
    companyId: Int
    managerId: Int
    name: String
    email: String
  }

  type GetDepartmentsResponse {
    departments: [Department]
  }

  type Location {
    id: Int
    companyId: Int
    countryId: Int
    name: String
    address1: String
    address2: String
    city: String
    postalCode: String
  }

  type GetLocationsResponse {
    locations: [Location]
  }

  type Query {
    getToken: NewToken
    getCompanies(pageNumber: Int!, pageSize: Int!, name: String, isBackOffice: Boolean): GetCompaniesResponse
    getDepartmentsByCompany(pageNumber: Int!, pageSize: Int!, companyId: Int!): GetDepartmentsResponse
    getLocationsByCompanyAndCountry(pageNumber: Int!, pageSize: Int!, companyId: Int!, countryId: Int!): GetLocationsResponse
  }

  type Mutation {
    signUp(
      companyName: String!
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      packageId: Int!
      paymentType: String!
      countryId: Int!
      currencyId: Int!
    ): ProcessCompleted
  }
`;

export default {
  resolvers: {
    Query: {
      getToken: (root: any, { input }: any, { token, error }: any) => {
        if (error === 503) {
          throw new ForbiddenError('Not authorised.');
        }
        if (error === 401) {
          const newToken = auth.signTokenByToken(token);

          if (newToken === '503') {
            throw new ForbiddenError('Not authorised.');
          }

          return { token: newToken };
        }

        return { token: '' };
      },
      getCompanies: (root: any, { pageNumber, pageSize, name, isBackOffice }: ICompanySearch, { token, error }: any) => {
        if (error === 503) {
          throw new ForbiddenError('Not authorised.');
        }
        if (error === 401) {
          const newToken = auth.signTokenByToken(token);

          if (newToken === '503') {
            throw new ForbiddenError('Not authorised.');
          }

          return { total: 0, companies: [] };
        }

        const input = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          name: name,
          isBackOffice: isBackOffice
        };

        return CompaniesService.getCompanies(input)
          .then(res => {
            return res;
          })
          .catch(error => {
            throw error;
          });
      },
      getDepartmentsByCompany: (root: any, { pageNumber, pageSize, companyId }: IDepartmentSearch, { token, error }: any) => {
        if (error === 503) {
          throw new ForbiddenError('Not authorised.');
        }
        if (error === 401) {
          const newToken = auth.signTokenByToken(token);

          if (newToken === '503') {
            throw new ForbiddenError('Not authorised.');
          }

          return { total: 0, companies: [] };
        }

        const input = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          companyId: companyId
        };

        return CompaniesService.getDepartments(input)
          .then(res => {
            return res;
          })
          .catch(error => {
            throw error;
          });
      },
      getLocationsByCompanyAndCountry: (
        root: any,
        { pageNumber, pageSize, companyId, countryId }: ILocationSearch,
        { token, error }: any
      ) => {
        if (error === 503) {
          throw new ForbiddenError('Not authorised.');
        }
        if (error === 401) {
          const newToken = auth.signTokenByToken(token);

          if (newToken === '503') {
            throw new ForbiddenError('Not authorised.');
          }

          return { total: 0, companies: [] };
        }

        const input = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          companyId: companyId,
          countryId: countryId
        };

        return CompaniesService.getLocations(input)
          .then(res => {
            return res;
          })
          .catch(error => {
            throw error;
          });
      }
    },
    Mutation: {
      signUp: (root: any, input: IInputSignUp) => {
        return CompaniesService.signUp(input)
          .then(res => {
            return {
              result: res
            };
          })
          .catch(error => {
            throw error;
          });
      }
    }
  },
  typeDefs: [typeDefs]
};
