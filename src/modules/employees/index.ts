import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import auth from '../../auth';
import { IEmployeeSearch, IInputSignIn } from 'src/__typedefs/graphqlTypes';
import EmployeesService from '../../services/employees/employees-service';

const typeDefs = gql`
  type Employee {
    id: ID!
    companyId: Int
    profileId: Int
    firstName: String
    lastName: String
    email: String
    password: String
    isActive: Boolean
    dateOfBirth: String
  }

  type NewToken {
    token: String
  }

  type ProcessCompleted {
    result: String
  }

  type UserSignedIn {
    employee: Employee
    token: String
  }

  type GetEmployeesResponse {
    total: Int
    employees: [Employee]
  }

  type Query {
    getToken: NewToken
    getEmployeesByDepartmentAndLocation(pageNumber: Int!, pageSize: Int!, departmentId: Int!, locationId: Int!): GetEmployeesResponse
      @rateLimit(limit: 100, duration: 60)
  }

  type Mutation {
    signOut: UserSignedIn
    signIn(email: String!, password: String!): UserSignedIn @rateLimit(limit: 5, duration: 5)
    signInAdmin(email: String!, password: String!): UserSignedIn @rateLimit(limit: 5, duration: 5)
    signInBackOffice(email: String!, password: String!): UserSignedIn @rateLimit(limit: 5, duration: 5)
    activateEmployeeAccount(id: Int!): ProcessCompleted
  }
`;

export default {
  resolvers: {
    Query: {
      getToken: (root: any, { input }: any, { token, error }: any) => {
        if (error === 503) {
          throw new GraphQLError('Not authorised.', {
            extensions: { code: '503' }
          });
        }
        if (error === 401) {
          const newToken = auth.signTokenByToken(token);

          if (newToken === '503') {
            throw new GraphQLError('Not authorised.', {
              extensions: { code: '503' }
            });
          }

          return { token: newToken };
        }

        return { token: '' };
      },
      getEmployeesByDepartmentAndLocation: (
        root: any,
        { pageNumber, pageSize, departmentId, locationId }: IEmployeeSearch,
        { token, error }: any
      ) => {
        if (error === 403) {
          throw new GraphQLError('Not authorised.', {
            extensions: { code: '403' }
          });
        }
        if (error === 401) {
          const newToken = auth.signTokenByToken(token);

          if (newToken === '403') {
            throw new GraphQLError('Not authorised.', {
              extensions: { code: '403' }
            });
          }

          return { total: 0, employees: [] };
        }

        const input = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          departmentId: departmentId,
          locationId: locationId
        };

        return EmployeesService.getEmployeesByDepartmentAndLocation(input, token)
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
      signIn: (root: any, input: IInputSignIn) => {
        return EmployeesService.signIn(input).then(employee => {
          if (employee.id) {
            const token = auth.signToken(employee);

            return { employee, token };
          }
          return {};
        });
      },
      signInAdmin: (root: any, input: IInputSignIn) => {
        return EmployeesService.signIn(input).then(employee => {
          if (employee.id) {
            const token = auth.signToken(employee);

            return { employee, token };
          }
          return {};
        });
      },
      signInBackOffice: (root: any, input: IInputSignIn) => {
        return EmployeesService.signInBackOffice(input).then(employee => {
          if (employee.id) {
            const token = auth.signToken(employee);

            return { employee, token };
          }
          return {};
        });
      },
      signOut: (root: any) => {
        return {
          employee: {
            id: 0
          },
          token: ''
        };
      },
      activateEmployeeAccount: (root: any, id: number) => {
        return { result: EmployeesService.activateEmployeeAccount(id) };
      }
    }
  },
  typeDefs: [typeDefs]
};
