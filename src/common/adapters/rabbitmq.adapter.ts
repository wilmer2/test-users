import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqplib, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { QueueBindingParams as IQueueBindingParams } from '../interfaces/queue-binding-params.interface';
import { BrokerAdapter as IBrokerAdapter } from '../interfaces/broker.adapter.interface';

@Injectable()
export class RabbitMqAdapter implements IBrokerAdapter {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private rabbitmqEndpoint: string;

  constructor(private readonly config: ConfigService) {
    const port = this.config.get('rabbitmqPort');
    const endpoint = this.config.get('rabbitmqEndpoint');

    this.rabbitmqEndpoint = `${endpoint}:${port}`;
  }

  public connect(): void {
    this.connection = amqplib.connect([this.rabbitmqEndpoint]);
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
    await this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(content)),
    );
  }

  public async receiveMessage(queueName: string): Promise<void> {
    console.log('Waiting for messages...');

    await new Promise<void>((resolve) => {
      this.channel.consume(queueName, (msg) => {
        const users = JSON.parse(msg.content.toString());
        users.map((user) => {
          console.log('*** user id ***', user.id);
        });

        this.channel.ack(msg);
      });

      resolve();
    });
  }
}
