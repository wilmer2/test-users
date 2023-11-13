import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HttpAdapter as IHttpAdapter } from '../interfaces/http.adapter.interface';

@Injectable()
export class AxiosAdapter implements IHttpAdapter {
  private axios: AxiosInstance = axios;

  public async get<T>(url: string): Promise<T> {
    let response;

    try {
      response = await this.axios.get<T>(url);
    } catch (error) {
      console.log('Error to fetch user data %s', error);

      throw new InternalServerErrorException(
        'Error obtaining data, please check the logs.',
      );
    }

    return response.data;
  }
}
