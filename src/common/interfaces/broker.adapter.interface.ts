import { QueueBindingParams } from './queue-binding-params.interface';

export interface BrokerAdapter {
  connect(): void;
  createChannel(): void;
  assertExchange(exchangeName: string, exchangeType: string): Promise<void>;
  assertQueue(queue: string): Promise<void>;
  bindToQueue(params: QueueBindingParams): Promise<void>;
  publish(exchange: string, routingKey: string, content: any): Promise<void>;
  receiveMessage(queue: string): Promise<void>;
}
