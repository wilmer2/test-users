import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from './interfaces/user-response.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserRepository {
  private url: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.url = this.config.get('remoteApiUrl');
  }

  public async getUsers(): Promise<UserResponse[]> {
    const response = await lastValueFrom(
      this.httpService.get<UserResponse[]>(this.url),
    );

    return response.data;
  }
}
