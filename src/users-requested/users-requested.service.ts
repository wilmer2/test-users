import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMqAdapter } from 'src/common/adapters/rabbitmq.adapter';

@Injectable()
export class UsersRequestedService implements OnModuleInit {
  constructor(private readonly broker: RabbitMqAdapter) {}

  public async onModuleInit(): Promise<void> {
    await this.broker.connect();
    await this.broker.createChannel();
    await this.broker.assertExchange('users-tas', 'fanout');
    await this.broker.assertQueue('cats_queue');
    await this.broker.bindToQueue({
      exchangeName: 'users-tas',
      queueName: 'cats_queue',
      //   pattern: 'notification',
    });

    await this.broker.receiveMessage('cats_queue');
  }
}
