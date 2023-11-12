import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMqAdapter } from 'src/common/adapters/rabbitmq.adapter';
import { USER_EXCHANGE, USER_QUEUE_REQUEST } from '../common/constants';

@Injectable()
export class UsersRequestedService implements OnModuleInit {
  constructor(private readonly broker: RabbitMqAdapter) {}

  public async onModuleInit(): Promise<void> {
    await this.broker.connect();
    await this.broker.createChannel();
    await this.broker.assertExchange(USER_EXCHANGE, 'fanout');
    await this.broker.assertQueue(USER_QUEUE_REQUEST);
    await this.broker.bindToQueue({
      exchangeName: USER_EXCHANGE,
      queueName: USER_QUEUE_REQUEST,
    });

    await this.broker.receiveMessage(USER_QUEUE_REQUEST);
  }
}
