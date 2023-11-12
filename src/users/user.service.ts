import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { UserResponse } from './interfaces/user-response.interface';
import { User as IUser } from './interfaces/user.interface';
import { sortArrayByProperty } from '../common/helpers';
import { SortOrder } from '../common/interfaces/sort-order.interface';

@Injectable()
export class UserService {
  constructor(private readonly http: AxiosAdapter) {}

  public async getUsers(): Promise<IUser[]> {
    const usersResponse = await this.http.get<UserResponse[]>(
      'https://jsonplaceholder.typicode.com/users',
    );

    const users: IUser[] = usersResponse.map((user) => {
      const { address, ...userWithoutAddress } = user;

      return userWithoutAddress;
    });

    const descendingOrderUsersById = sortArrayByProperty<IUser>(
      users,
      'id',
      SortOrder.Desc,
    );

    return descendingOrderUsersById;
  }
}
