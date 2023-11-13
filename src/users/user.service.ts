import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { UserResponse } from './interfaces/user-response.interface';
import { User } from './interfaces/user.interface';
import { sortArrayByProperty } from '../common/helpers';
import { SortOrder } from '../common/interfaces/sort-order.interface';
import { UsersRequestedPublishService as UserPublishService } from '../users-requested-publish/users-requested-publish.service';

@Injectable()
export class UserService {
  private url: string;

  constructor(
    private readonly http: AxiosAdapter,
    private readonly config: ConfigService,
    private readonly userPublishService: UserPublishService,
  ) {
    this.url = this.config.get('remoteApiUrl');
  }

  public async getUsers(): Promise<User[]> {
    const usersResponse = await this.http.get<UserResponse[]>(this.url);

    const users: User[] = usersResponse.map((user) => {
      const { address, ...userWithoutAddress } = user;

      return userWithoutAddress;
    });

    const descendingOrderUsersById = sortArrayByProperty<User>(
      users,
      'id',
      SortOrder.Desc,
    );

    return descendingOrderUsersById;
  }

  public async publishUsersWithEvenId(users: User[]): Promise<void> {
    const evenUsers = users.filter((user) => user.id % 2 === 0);

    await this.userPublishService.publishUsers(evenUsers);
  }
}
