import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { UserBrokerEnum } from '../common/constants';

@Injectable()
export class UsersRequestedService implements OnModuleInit {
  constructor(private readonly broker: RabbitMqAdapter) {}

  public async onModuleInit(): Promise<void> {
    await this.broker.connect();
    await this.broker.createChannel();
    await this.broker.assertExchange(UserBrokerEnum.USER_EXCHANGE, 'fanout');
    await this.broker.assertQueue(UserBrokerEnum.USER_QUEUE_REQUEST);
    await this.broker.bindToQueue({
      exchangeName: UserBrokerEnum.USER_EXCHANGE,
      queueName: UserBrokerEnum.USER_QUEUE_REQUEST,
    });

    await this.broker.receiveMessage(UserBrokerEnum.USER_QUEUE_REQUEST);
  }
}
