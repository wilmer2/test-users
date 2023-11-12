import { Injectable } from '@nestjs/common';
import amqplib, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { QueueBindingParams as IQueueBindingParams } from '../interfaces/rabbitmq/queue-binding-params.interface';

@Injectable()
export class RabbitMqAdapter {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  public connect(): void {
    this.connection = amqplib.connect(['amqp://localhost:5673']);
  }

  public createChannel(): void {
    this.channel = this.connection.createChannel();
  }

  public async assertExchange(
    exchangeName: string,
    exchangeType: string,
  ): Promise<void> {
    await this.channel.addSetup(async (channel) => {
      channel.assertExchange(exchangeName, exchangeType);
    });
  }

  public async assertQueue(queue: string) {
    await this.channel.addSetup((channel) => {
      channel.assertQueue(queue, {
        durable: false,
      });
    });
  }

  public async bindToQueue({
    exchangeName,
    queueName,
    pattern = '',
  }: IQueueBindingParams): Promise<void> {
    await this.channel.addSetup((channel) => {
      channel.bindQueue(queueName, exchangeName, pattern);
    });
  }

  public async publish(
    exchange: string,
    routingKey: string = '',
    content: any,
  ): Promise<void> {
    await this.channel.publish(exchange, routingKey, Buffer.from(content));
  }

  async receiveMessage(queueName: string): Promise<void> {
    console.log('Waiting for messages...');

    await new Promise<void>((resolve) => {
      this.channel.consume(queueName, (msg) => {
        const message = msg.content.toString();
        console.log(`Received message: ${message}`);
        this.channel.ack(msg);
      });

      resolve();
    });
  }
}
