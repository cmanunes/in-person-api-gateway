import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
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
      @rateLimit(limit: 100, duration: 60)
    getDepartmentsByCompany(pageNumber: Int!, pageSize: Int!, companyId: Int!): GetDepartmentsResponse @rateLimit(limit: 100, duration: 60)
    getLocationsByCompanyAndCountry(pageNumber: Int!, pageSize: Int!, companyId: Int!, countryId: Int!): GetLocationsResponse
      @rateLimit(limit: 100, duration: 60)
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
      getToken: (parent: any, args: any, contextValue: any) => {
        if (contextValue.error === 403) {
          throw new GraphQLError('Not authorised.', {
            extensions: { code: '403' }
          });
        }
        if (contextValue.error === 401) {
          throw new GraphQLError('Not authenticated.', {
            extensions: { code: '401' }
          });
        }

        return { token: '' };
      },
      getCompanies: (parent: any, args: any, contextValue: any) => {
        if (contextValue.error === 403) {
          throw new GraphQLError('Not authorised.', {
            extensions: { code: '403' }
          });
        }
        if (contextValue.error === 401) {
          throw new GraphQLError('Not authenticated.', {
            extensions: { code: '401' }
          });
        }

        const input = {
          pageNumber: args.pageNumber,
          pageSize: args.pageSize,
          name: args.name,
          isBackOffice: args.isBackOffice
        };

        return CompaniesService.getCompanies(input, contextValue.token)
          .then(res => {
            return res.data;
          })
          .catch(error => {
            if (error.response?.status === 429) {
              throw new GraphQLError('Too many requests.', {
                extensions: { code: '429' }
              });
            }

            throw error;
          });
      },
      getDepartmentsByCompany: (parent: any, args: any, contextValue: any) => {
        if (contextValue.error === 403) {
          throw new GraphQLError('Not authorised.', {
            extensions: { code: '403' }
          });
        }
        if (contextValue.error === 401) {
          throw new GraphQLError('Not authenticated.', {
            extensions: { code: '401' }
          });
        }

        const input = {
          pageNumber: args.pageNumber,
          pageSize: args.pageSize,
          companyId: args.companyId
        };

        return CompaniesService.getDepartments(input, contextValue.token)
          .then(res => {
            return res.data;
          })
          .catch(error => {
            if (error.response?.status === 429) {
              throw new GraphQLError('Too many request.', {
                extensions: { code: '429' }
              });
            }

            throw error;
          });
      },
      getLocationsByCompanyAndCountry: (parent: any, args: any, contextValue: any) => {
        if (contextValue.error === 403) {
          throw new GraphQLError('Not authorised.', {
            extensions: { code: '403' }
          });
        }
        if (contextValue.error === 401) {
          throw new GraphQLError('Not authenticated.', {
            extensions: { code: '401' }
          });
        }

        const input = {
          pageNumber: args.pageNumber,
          pageSize: args.pageSize,
          companyId: args.companyId,
          countryId: args.countryId
        };

        return CompaniesService.getLocations(input, contextValue.token)
          .then(res => {
            return res.data;
          })
          .catch(error => {
            if (error.response?.status === 429) {
              throw new GraphQLError('Too many requests.', {
                extensions: { code: '429' }
              });
            }

            throw error;
          });
      }
    },
    Mutation: {
      // TODO - Test this again because of changes to Apollo server
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
