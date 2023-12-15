import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { rateLimitDirective } = require('graphql-rate-limit-directive');
import express from 'express';
import http from 'http';
import cors from 'cors';

export const app = express();
const xss = require('xss-clean');
const httpServer = http.createServer(app);

import config from '../config';
import auth from '../auth';
import companies from '../modules/companies';
import packages from '../modules/packages';
import employees from '../modules/employees';

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
    typeDefs: [rateLimitDirectiveTypeDefs, companies.typeDefs, packages.typeDefs, employees.typeDefs],
    resolvers: [companies.resolvers, packages.resolvers, employees.resolvers]
  });
  schema = rateLimitDirectiveTransformer(schema);

  const apolloServer = new ApolloServer({ schema });

  app.disable('x-powered-by');

  // to force express to recognize connection as HTTPS and receive cookie with 'secure' set
  app.set('trust proxy', 1);

  await apolloServer.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    xss(),
    expressMiddleware(apolloServer, {
      context: await auth.handleGraphQLContext
    })
  );

  await new Promise<void>(resolve => httpServer.listen({ port: config.port }, resolve));

  console.log(`API Gateway Server running on port: ${config.port}`);
};

export default { startServer };
