import { AuthenticationError, ForbiddenError, gql } from 'apollo-server-express';
import auth from '../../auth';
import { IInputSignIn } from 'src/__typedefs/graphqlTypes';
import EmployeesService from '../../services/employees/employees-service';

const typeDefs = gql`
  type Employee {
    id: ID!
    companyId: Int
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

  type Query {
    getToken: NewToken
  }

  type UserSignedIn {
    employee: Employee
    token: String
  }

  type Mutation {
    signOut: UserSignedIn
    signIn(email: String!, password: String!): UserSignedIn
    signInAdmin(email: String!, password: String!): UserSignedIn
    signInBackOffice(email: String!, password: String!): UserSignedIn
    activateEmployeeAccount(id: Int!): ProcessCompleted
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
        return EmployeesService.signIn(input).then(employee => {
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