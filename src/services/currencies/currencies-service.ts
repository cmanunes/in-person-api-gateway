import axios, { AxiosResponse } from 'axios';
import config from '../../config';

const apiUrl = config.packagesService.url;

export default class CurrenciesService {
  static async getCurrencies() {
    const url = `${apiUrl}/currencies`;
    const body = ((await axios.get(url)) as AxiosResponse).data as any;

    return body;
  }
}
