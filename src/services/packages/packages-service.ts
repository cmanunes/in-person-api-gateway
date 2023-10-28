import axios, { AxiosResponse } from 'axios';
import config from '../../config';

const apiUrl = config.packagesService.url;

export default class PackagesService {
  static async getPackages() {
    const url = `${apiUrl}/packages`;
    const body = ((await axios.get(url)) as AxiosResponse).data as any;

    return body;
  }
}
