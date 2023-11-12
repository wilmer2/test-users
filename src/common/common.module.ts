import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AxiosAdapter } from './adapters/axios.adapter';
import { RabbitMqAdapter } from './adapters/rabbitmq.adapter';

@Module({
  imports: [ConfigModule],
  providers: [AxiosAdapter, RabbitMqAdapter],
  exports: [AxiosAdapter, RabbitMqAdapter],
})
export class CommonModule {}
