import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import auth from '../../auth';
import { IEmployeeSearch, IInputSignIn } from 'src/__typedefs/graphqlTypes';
import EmployeesService from '../../services/employees/employees-service';

const typeDefs = gql`
  type Employee {
    id: Int!
    companyId: Int!
    locationId: Int
    departmentId: Int
    currencyId: Int
    managerId: Int
    teamId: Int
    profileId: Int
    employmentTypeId: Int
    employeeStatusId: Int
    employeeId: String
    title: String
    firstName: String!
    middleNames: String
    lastName: String!
    dateOfBirth: String
    email: String
    maritalStatus: String
    password: String
    contact: String
    emergencyContact: String
    experienceTime: Int
    skills: String
    userMonthlyCost: Int
    userYearlyCost: Int
    paymentType: String
    startingDate: String
    finishingDate: String
    probationStartDate: String
    probationEndDate: String
    createdDate: String
    updatedDate: String
    isBackOffice: Boolean!
    isActive: Boolean!
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
    getEmployees(pageNumber: Int!, pageSize: Int!, companyId: Int!, name: String): GetEmployeesResponse @rateLimit(limit: 100, duration: 60)
    getEmployeeById(id: Int!, companyId: Int!): Employee @rateLimit(limit: 100, duration: 60)
    getEmployeesByDepartmentAndLocation(pageNumber: Int!, pageSize: Int!, departmentId: Int!, locationId: Int!): GetEmployeesResponse
      @rateLimit(limit: 100, duration: 60)
  }

  type Mutation {
    signOut: UserSignedIn
    signIn(email: String!, password: String!): UserSignedIn @rateLimit(limit: 5, duration: 5)
    signInAdmin(email: String!, password: String!): UserSignedIn @rateLimit(limit: 5, duration: 5)
    signInBackOffice(email: String!, password: String!): UserSignedIn @rateLimit(limit: 5, duration: 5)
    activateEmployeeAccount(id: Int!): ProcessCompleted
    updateEmployee(
      id: Int!
      companyId: Int!
      locationId: Int
      departmentId: Int
      currencyId: Int
      managerId: Int
      teamId: Int
      profileId: Int
      employmentTypeId: Int
      employeeStatusId: Int
      employeeId: String
      title: String
      firstName: String!
      middleNames: String
      lastName: String!
      dateOfBirth: String
      email: String
      maritalStatus: String
      password: String
      contact: String
      emergencyContact: String
      experienceTime: Int
      skills: String
      userMonthlyCost: String
      userYearlyCost: String
      paymentType: String
      startingDate: String
      finishingDate: String
      probationStartDate: String
      probationEndDate: String
      createdDate: String
      updatedDate: String
      isBackOffice: Boolean!
      isActive: Boolean!
    ): Result @rateLimit(limit: 50, duration: 60)
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
      getEmployees: (parent: any, args: any, contextValue: any) => {
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
        if (!contextValue.token) {
          throw new GraphQLError('Not authenticated.', {
            extensions: { code: '401' }
          });
        }

        if (args.companyId <= 0) {
          throw new GraphQLError("Missing employees' companyId.", {
            extensions: { code: '400' }
          });
        }

        const input = {
          pageNumber: args.pageNumber,
          pageSize: args.pageSize,
          companyId: args.companyId,
          name: args.name
        };

        return EmployeesService.getEmployees(input, contextValue.token)
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
      getEmployeeById: (parent: any, args: any, contextValue: any) => {
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
        if (!contextValue.token) {
          throw new GraphQLError('Not authenticated.', {
            extensions: { code: '401' }
          });
        }

        if (args.id <= 0) {
          throw new GraphQLError("Missing employees' id.", {
            extensions: { code: '400' }
          });
        }

        if (args.companyId <= 0) {
          throw new GraphQLError("Missing employees' companyId.", {
            extensions: { code: '400' }
          });
        }

        return EmployeesService.getEmployeeById(args.id, args.companyId, contextValue.token)
          .then(res => {
            return res;
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
      },
      updateEmployee: (parent: any, args: any, contextValue: any) => {
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
        if (!contextValue.token) {
          throw new GraphQLError('Not authenticated.', {
            extensions: { code: '401' }
          });
        }

        if (args.id <= 0) {
          throw new GraphQLError('Missing employee Id.', {
            extensions: { code: '400' }
          });
        }

        if (args.companyId <= 0) {
          throw new GraphQLError('Missing employee company Id.', {
            extensions: { code: '400' }
          });
        }

        if (args.firstName <= 0) {
          throw new GraphQLError('Missing employee first name.', {
            extensions: { code: '400' }
          });
        }

        if (args.lastName <= 0) {
          throw new GraphQLError('Missing employee last name.', {
            extensions: { code: '400' }
          });
        }

        return EmployeesService.updateEmployee(
          args.id,
          args.companyId,
          args.locationId,
          args.departmentId,
          args.currencyId,
          args.managerId,
          args.teamId,
          args.profileId,
          args.employmentTypeId,
          args.employeeStatusId,
          args.employeeId,
          args.title,
          args.firstName,
          args.middleNames,
          args.lastName,
          args.dateOfBirth,
          args.email,
          args.maritalStatus,
          args.password,
          args.contact,
          args.emergencyContact,
          args.experienceTime,
          args.skills,
          args.userMonthlyCost,
          args.userYearlyCost,
          args.paymentType,
          args.startingDate,
          args.finishingDate,
          args.probationStartDate,
          args.probationEndDate,
          args.createdDate,
          args.updatedDate,
          args.isBackOffice,
          args.isActive,
          contextValue.token
        )
          .then(res => {
            return res;
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
    }
  },
  typeDefs: [typeDefs]
};
