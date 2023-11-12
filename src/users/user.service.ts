import { Injectable, OnModuleInit } from '@nestjs/common';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { UserResponse } from './interfaces/user-response.interface';
import { User as IUser } from './interfaces/user.interface';
import { sortArrayByProperty } from '../common/helpers';
import { SortOrder } from '../common/interfaces/sort-order.interface';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly http: AxiosAdapter,
    private readonly broker: RabbitMqAdapter,
  ) {}

  public async onModuleInit(): Promise<void> {
    this.broker.connect();
    this.broker.createChannel();
    await this.broker.assertExchange('users-tas', 'fanout');
    await this.broker.assertQueue('cats_queue');
    await this.broker.bindToQueue({
      exchangeName: 'users-tas',
      queueName: 'cats_queue',
    });
  }

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

  public async publishUsers(users: IUser[]): Promise<void> {
    const evenUsers = users.filter((user) => user.id % 2 === 0);

    await this.broker.publish('users-tas', '', evenUsers);
  }
}
