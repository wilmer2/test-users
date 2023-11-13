import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { sortArrayByProperty } from '../common/helpers';
import { SortOrder } from '../common/interfaces/sort-order.interface';
import { UsersRequestedPublishService as UserPublishService } from '../users-requested-publish/users-requested-publish.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userPublishService: UserPublishService,
    private readonly userRepository: UserRepository,
  ) {}

  public async getUsers(): Promise<User[]> {
    const usersResponse = await this.userRepository.getUsers();

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
