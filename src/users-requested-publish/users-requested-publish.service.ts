import { Injectable } from '@nestjs/common';
import { USER_EXCHANGE, USER_QUEUE_REQUEST } from '../common/constants';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class UsersRequestedPublishService {
  constructor(private readonly broker: RabbitMqAdapter) {}

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

  public async publishUsers(users: User[]): Promise<void> {
    const evenUsers = users.filter((user) => user.id % 2 === 0);

    await this.broker.publish(USER_EXCHANGE, '', evenUsers);
  }
}
