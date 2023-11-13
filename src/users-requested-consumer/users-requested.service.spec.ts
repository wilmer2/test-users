import { Test, TestingModule } from '@nestjs/testing';
import { UsersRequestedService } from './users-requested.service';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { UserBrokerEnum } from '../common/constants';
import { brokerMock as brokerMockData } from '../../__mock__';

describe('UsersRequestedService', () => {
  let service: UsersRequestedService;
  let brokerMock: jest.Mocked<RabbitMqAdapter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UsersRequestedService,
        {
          provide: RabbitMqAdapter,
          useValue: { ...brokerMockData },
        },
      ],
    }).compile();

    service = module.get<UsersRequestedService>(UsersRequestedService);
    brokerMock = module.get(RabbitMqAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#onModuleInit()', () => {
    beforeEach(() => {
      brokerMock.connect.mockClear();
      brokerMock.createChannel.mockClear();
      brokerMock.assertExchange.mockClear();
      brokerMock.assertQueue.mockClear();
      brokerMock.bindToQueue.mockClear();
      brokerMock.receiveMessage.mockClear();
    });

    it('Should call all its internal methods', async () => {
      await service.onModuleInit();

      expect(brokerMock.connect).toHaveBeenCalled();
      expect(brokerMock.createChannel).toHaveBeenCalled();
      expect(brokerMock.assertExchange).toHaveBeenCalled();
      expect(brokerMock.assertQueue).toHaveBeenCalled();
      expect(brokerMock.bindToQueue).toHaveBeenCalled();
      expect(brokerMock.receiveMessage).toHaveBeenCalled();
    });

    it('Should call its internal method with the correct parameters', async () => {
      await service.onModuleInit();
      const exchangeType = 'fanout';

      expect(brokerMock.assertExchange).toHaveBeenCalledWith(
        UserBrokerEnum.USER_EXCHANGE,
        exchangeType,
      );
      expect(brokerMock.assertQueue).toHaveBeenCalledWith(
        UserBrokerEnum.USER_QUEUE_REQUEST,
      );
      expect(brokerMock.bindToQueue).toHaveBeenCalledWith({
        exchangeName: UserBrokerEnum.USER_EXCHANGE,
        queueName: UserBrokerEnum.USER_QUEUE_REQUEST,
      });

      expect(brokerMock.receiveMessage).toHaveBeenCalledWith(
        UserBrokerEnum.USER_QUEUE_REQUEST,
      );
    });
  });
});
