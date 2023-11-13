import { Test, TestingModule } from '@nestjs/testing';
import { UsersRequestedService } from './users-requested.service';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { UserBrokerEnum } from '../common/constants';
import { mockBrocker } from '../../__mock__';

describe('UsersRequestedService', () => {
  let service: UsersRequestedService;
  let brockerService: jest.Mocked<RabbitMqAdapter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [UsersRequestedService, RabbitMqAdapter],
    })
      .overrideProvider(RabbitMqAdapter)
      .useValue(mockBrocker)
      .compile();

    service = module.get<UsersRequestedService>(UsersRequestedService);
    brockerService = module.get(RabbitMqAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#onModuleInit()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should call all its internal methods', async () => {
      await service.onModuleInit();

      expect(brockerService.connect).toHaveBeenCalled();
      expect(brockerService.createChannel).toHaveBeenCalled();
      expect(brockerService.assertExchange).toHaveBeenCalled();
      expect(brockerService.assertQueue).toHaveBeenCalled();
      expect(brockerService.bindToQueue).toHaveBeenCalled();
      expect(brockerService.receiveMessage).toHaveBeenCalled();
    });

    it('Should call its internal method with the correct parameters', async () => {
      await service.onModuleInit();
      const exchangeType = 'fanout';

      expect(brockerService.assertExchange).toHaveBeenCalledWith(
        UserBrokerEnum.USER_EXCHANGE,
        exchangeType,
      );
      expect(brockerService.assertQueue).toHaveBeenCalledWith(
        UserBrokerEnum.USER_QUEUE_REQUEST,
      );
      expect(brockerService.bindToQueue).toHaveBeenCalledWith({
        exchangeName: UserBrokerEnum.USER_EXCHANGE,
        queueName: UserBrokerEnum.USER_QUEUE_REQUEST,
      });

      expect(brockerService.receiveMessage).toHaveBeenCalledWith(
        UserBrokerEnum.USER_QUEUE_REQUEST,
      );
    });
  });
});
