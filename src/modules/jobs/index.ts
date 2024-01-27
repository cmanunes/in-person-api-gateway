import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import auth from '../../auth';
import { IJobSearch } from 'src/__typedefs/graphqlTypes';
import JobsService from '../../services/jobs/jobs-service';

const typeDefs = gql`
  type Job {
    id: Int
    companyId: Int
    jobStageId: Int
    jobStageName: String
    name: String
  }

  type GetJobsResponse {
    total: Int
    jobs: [Job]
  }

  type JobStage {
    id: Int
    name: String
  }

  type Query {
    getJobStages: [JobStage] @rateLimit(limit: 100, duration: 60)
    getJobs(pageNumber: Int!, pageSize: Int!, name: String, jobStageId: Int, companyId: Int!): GetJobsResponse
      @rateLimit(limit: 100, duration: 60)
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
    }
  },
  typeDefs: [typeDefs]
};
