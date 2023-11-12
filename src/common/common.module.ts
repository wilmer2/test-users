import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';
import { RabbitMqAdapter } from './adapters/rabbitmq.adapter';

@Module({
  providers: [AxiosAdapter, RabbitMqAdapter],
  exports: [AxiosAdapter, RabbitMqAdapter],
})
export class CommonModule {}
