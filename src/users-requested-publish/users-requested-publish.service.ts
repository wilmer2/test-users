import { Injectable } from '@nestjs/common';
import { UserBrokerEnum } from '../common/constants';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class UsersRequestedPublishService {
  constructor(private readonly broker: RabbitMqAdapter) {}

  public async onModuleInit(): Promise<void> {
    this.broker.connect();
    this.broker.createChannel();
    await this.broker.assertExchange(UserBrokerEnum.USER_EXCHANGE, 'fanout');
    await this.broker.assertQueue(UserBrokerEnum.USER_QUEUE_REQUEST);
    await this.broker.bindToQueue({
      exchangeName: UserBrokerEnum.USER_EXCHANGE,
      queueName: UserBrokerEnum.USER_QUEUE_REQUEST,
    });
  }

  public async publishUsers(users: User[]): Promise<void> {
    const evenUsers = users.filter((user) => user.id % 2 === 0);

    await this.broker.publish(UserBrokerEnum.USER_EXCHANGE, '', evenUsers);
  }
}
