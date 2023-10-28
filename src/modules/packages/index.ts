import { AuthenticationError, ForbiddenError, gql } from 'apollo-server-express';
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
    getPackages: [Package]
    getCountries: [Country]
    getCurrencies: [Currency]
  }
`;

export default {
  resolvers: {
    Query: {
      getPackages: (root: any, { token, error }: any) => {
        if (error === 503) {
          throw new ForbiddenError('Not authorised.');
        }
        if (error === 401) {
          throw new AuthenticationError('Not authenticated.');
        }

        return PackagesService.getPackages();
      },
      getCountries: (root: any, { token, error }: any) => {
        if (error === 503) {
          throw new ForbiddenError('Not authorised.');
        }
        if (error === 401) {
          throw new AuthenticationError('Not authenticated.');
        }

        return CountriesService.getCountries();
      },
      getCurrencies: (root: any, { token, error }: any) => {
        if (error === 503) {
          throw new ForbiddenError('Not authorised.');
        }
        if (error === 401) {
          throw new AuthenticationError('Not authenticated.');
        }

        return CurrenciesService.getCurrencies();
      }
    }
  },
  typeDefs: [typeDefs]
};
