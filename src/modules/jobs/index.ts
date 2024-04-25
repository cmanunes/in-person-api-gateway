import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import JobsService from '../../services/jobs/jobs-service';

const typeDefs = gql`
  type Job {
    id: Int
    companyId: Int
    jobStageId: Int
    jobStageName: String
    name: String
    description: String
    termsAndConditions: String
    privacyNotice: String
    questions: [JobQuestion]
    createdAt: String
    updatedAt: String
  }

  type GetJobsResponse {
    total: Int
    jobs: [Job]
  }

  type JobQuestion {
    id: Int
    jobId: Int
    questionType: Int!
    questionText: String!
    isMandatory: Boolean!
    createdAt: String!
  }

  type JobCandidateAnswer {
    id: Int
    jobId: Int
    jobQuestionId: Int!
    candidateId: Int
    answerText: String
    answerOption: String
    createdAt: String!
  }

  type JobStage {
    id: Int
    name: String
  }

  type Result {
    error: String
  }

  type Query {
    getJobStages: [JobStage] @rateLimit(limit: 100, duration: 60)
    getJobById(jobId: Int!, companyId: Int!): Job @rateLimit(limit: 100, duration: 60)
    getJobs(pageNumber: Int!, pageSize: Int!, name: String, jobStageId: Int, companyId: Int!): GetJobsResponse
      @rateLimit(limit: 100, duration: 60)
  }

  type Mutation {
    deleteJobById(id: Int!): Job @rateLimit(limit: 50, duration: 60)
    createJob(
      id: Int
      companyId: Int!
      jobStageId: Int
      name: String!
      description: String!
      termsAndConditions: String
      privacyNotice: String
      questions: String
    ): Result @rateLimit(limit: 50, duration: 60)
    updateJob(
      id: Int!
      companyId: Int!
      jobStageId: Int!
      name: String!
      description: String!
      termsAndConditions: String
      privacyNotice: String
      questions: String
    ): Result @rateLimit(limit: 50, duration: 60)
  }
`;

export default {
  resolvers: {
    Query: {
      getJobStages: (parent: any, args: any, contextValue: any) => {
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

        return JobsService.getJobStages(contextValue.token);
      },
      getJobById: (parent: any, args: any, contextValue: any) => {
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

        return JobsService.getJobById(args.jobId, args.companyId, contextValue.token)
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
      getJobs: (parent: any, args: any, contextValue: any) => {
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

        const input = {
          pageNumber: args.pageNumber,
          pageSize: args.pageSize,
          name: args.name,
          jobStageId: args.jobStageId,
          companyId: args.companyId
        };
        return JobsService.getJobs(input, contextValue.token)
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
    },
    Mutation: {
      deleteJobById: (parent: any, args: any, contextValue: any) => {
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

        return JobsService.deleteJobById(args.id, contextValue.token)
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
      createJob: (parent: any, args: any, contextValue: any) => {
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

        return JobsService.createJob(
          args.id,
          args.companyId,
          args.jobStageId,
          args.name,
          args.description,
          args.termsAndConditions,
          args.privacyNotice,
          args.questions,
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
      },
      updateJob: (parent: any, args: any, contextValue: any) => {
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

        return JobsService.updateJob(
          args.id,
          args.companyId,
          args.jobStageId,
          args.name,
          args.description,
          args.termsAndConditions,
          args.privacyNotice,
          args.questions,
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
