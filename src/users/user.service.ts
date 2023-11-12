import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { UserResponse } from './interfaces/user-response.interface';
import { User as IUser } from './interfaces/user.interface';
import { sortArrayByProperty } from '../common/helpers';
import { SortOrder } from '../common/interfaces/sort-order.interface';
import { USER_EXCHANGE, USER_QUEUE_REQUEST } from '../common/constants';

@Injectable()
export class UserService implements OnModuleInit {
  private url: string;

  constructor(
    private readonly http: AxiosAdapter,
    private readonly broker: RabbitMqAdapter,
    private readonly config: ConfigService,
  ) {
    this.url = this.config.get('remoteApiUrl');
  }

  public async onModuleInit(): Promise<void> {
    this.broker.connect();
    this.broker.createChannel();
    await this.broker.assertExchange(USER_EXCHANGE, 'fanout');
    await this.broker.assertQueue(USER_QUEUE_REQUEST);
    await this.broker.bindToQueue({
      exchangeName: USER_EXCHANGE,
      queueName: USER_QUEUE_REQUEST,
    });
  }

  public async getUsers(): Promise<IUser[]> {
    const usersResponse = await this.http.get<UserResponse[]>(this.url);

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

    await this.broker.publish(USER_EXCHANGE, '', evenUsers);
  }
}
