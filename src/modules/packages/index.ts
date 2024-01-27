import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import auth from '../../auth';
import PackagesService from '../../services/packages/packages-service';
import CountriesService from '../../services/countries/countries-service';
import CurrenciesService from '../../services/currencies/currencies-service';

const typeDefs = gql`
  type Package {
    id: Int
    name: String
  }

  type Country {
    id: Int
    name: String
  }

  type Currency {
    id: Int
    name: String
  }

  type Query {
    getPackages: [Package] @rateLimit(limit: 200, duration: 60)
    getCountries: [Country] @rateLimit(limit: 200, duration: 60)
    getCurrencies: [Currency] @rateLimit(limit: 200, duration: 60)
  }
`;

export default {
  resolvers: {
    Query: {
      getPackages: (parent: any, args: any, contextValue: any) => {
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

        return PackagesService.getPackages();
      },
      getCountries: (parent: any, args: any, contextValue: any) => {
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

        return CountriesService.getCountries();
      },
      getCurrencies: (parent: any, args: any, contextValue: any) => {
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

        return CurrenciesService.getCurrencies();
      }
    }
  },
  typeDefs: [typeDefs]
};
