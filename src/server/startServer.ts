import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { rateLimitDirective } = require('graphql-rate-limit-directive');

import config from '../config';
import auth from '../auth';
import companies from '../modules/companies';
import packages from '../modules/packages';
import employees from '../modules/employees';
import jobs from '../modules/jobs';

class RateLimitError extends Error {
  extensions: { code: string; error: string; resetAt: Date };
  constructor(msBeforeNextReset: number) {
    super('Too many requests, please try again shortly.');

    // Determine when the rate limit will be reset so the client can try again
    const resetAt = new Date();
    resetAt.setTime(resetAt.getTime() + msBeforeNextReset);

    // GraphQL will automatically use this field to return extensions data in the GraphQLError
    // See https://github.com/graphql/graphql-js/pull/928
    this.extensions = {
      code: '429',
      error: 'RATE_LIMITED',
      resetAt
    };
  }
}
// IMPORTANT: Specify how a rate limited field should behave when a limit has been exceeded
const onLimit = (resource: { msBeforeNext: number }) => {
  throw new RateLimitError(resource.msBeforeNext);
};

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective({
  onLimit
});

const startServer = async () => {
  let schema = makeExecutableSchema({
    typeDefs: [rateLimitDirectiveTypeDefs, companies.typeDefs, packages.typeDefs, employees.typeDefs, jobs.typeDefs],
    resolvers: [companies.resolvers, packages.resolvers, employees.resolvers, jobs.resolvers]
  });
  schema = rateLimitDirectiveTransformer(schema);

  const apolloServer = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(apolloServer, {
    context: async ({ req, res }) => {
      const ctx = await auth.handleGraphQLContext(req, res);

      return { token: ctx.token, error: ctx.error };
    },
    listen: { port: config.port }
  });

  console.log(`API Gateway Server running on port: ${config.port}`);
};

export default { startServer };
