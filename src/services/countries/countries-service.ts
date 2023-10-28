import axios, { AxiosResponse } from 'axios';
import config from '../../config';

const apiUrl = config.packagesService.url;

export default class CountriesService {
  static async getCountries() {
    const url = `${apiUrl}/countries`;
    const body = ((await axios.get(url)) as AxiosResponse).data as any;

    return body;
  }
}
