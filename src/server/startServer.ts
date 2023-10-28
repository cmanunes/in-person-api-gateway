import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';

import config from '../config';
import express from 'express';
import auth from '../auth';
import companies from '../modules/companies';
import packages from '../modules/packages';
import employees from '../modules/employees';

const xss = require('xss-clean');
export const app = express();
const { mergeSchemas } = require('@graphql-tools/schema');

const startServer = async () => {
  const apolloServer = new ApolloServer({
    schema: mergeSchemas({
      typeDefs: [companies.typeDefs, packages.typeDefs, employees.typeDefs],
      resolvers: [companies.resolvers, packages.resolvers, employees.resolvers]
    }),
    context: await auth.handleGraphQLContext,
    debug: false
  });

  app.use(
    cors(/*{
      origin: [config.webApp.url],
      credentials: true
    }*/)
  );
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(xss());

  // to force express to recognize connection as HTTPS and receive cookie with 'secure' set
  app.set('trust proxy', 1);

  // TODO: Implement rate limit here
  // How tos
  // https://www.digitalocean.com/community/tutorials/how-to-build-a-rate-limiter-with-node-js-on-app-platform
  // https://blog.logrocket.com/rate-limiting-node-js/

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false, path: '/graphql' });

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`API gateway listening on ${config.port}`);
  });
};

export default { startServer };
