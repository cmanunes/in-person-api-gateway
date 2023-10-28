import { ForbiddenError, gql } from 'apollo-server-express';
import auth from '../../auth';
import { ICompanySearch, IInputSignUp } from 'src/__typedefs/graphqlTypes';
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
    currencyId: Int
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

  type Query {
    getToken: NewToken
    getCompanies(pageNumber: Int!, pageSize: Int!, name: String, isBackOffice: Boolean): GetCompaniesResponse
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
