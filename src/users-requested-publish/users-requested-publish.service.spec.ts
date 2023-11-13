import { Test, TestingModule } from '@nestjs/testing';
import { UsersRequestedPublishService } from './users-requested-publish.service';
import { usersMock, mockBrocker } from '../../__mock__';
import { UserBrokerEnum } from '../common/constants';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';

describe('UsersRequestedPublishService', () => {
  let service: UsersRequestedPublishService;
  let brockerService: jest.Mocked<RabbitMqAdapter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRequestedPublishService, RabbitMqAdapter],
    })
      .overrideProvider(RabbitMqAdapter)
      .useValue(mockBrocker)
      .compile();

    service = module.get<UsersRequestedPublishService>(
      UsersRequestedPublishService,
    );

    brockerService = module.get(RabbitMqAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#publishUsers', () => {
    beforeEach(() => {
      brockerService.publish.mockClear();
    });

    it('should call the publish method of the broken', async () => {
      await service.publishUsers(usersMock);
      expect(brockerService.publish).toHaveBeenCalled();
    });

    it('Should be called with the correct parameters', async () => {
      await service.publishUsers(usersMock);

      const expectedOrder = usersMock.filter((user) => user.id % 2 === 0);

      expect(brockerService.publish).toHaveBeenCalledWith(
        UserBrokerEnum.USER_EXCHANGE,
        '',
        expectedOrder,
      );
    });
  });

  describe('#onModuleInit', () => {
    beforeEach(() => {
      brockerService.connect.mockClear();
      brockerService.createChannel.mockClear();
      brockerService.assertExchange.mockClear();
      brockerService.assertQueue.mockClear();
      brockerService.bindToQueue.mockClear();
      brockerService.receiveMessage.mockClear();
    });

    it('Should call all its internal methods', async () => {
      await service.onModuleInit();

      expect(brockerService.connect).toHaveBeenCalled();
      expect(brockerService.createChannel).toHaveBeenCalled();
      expect(brockerService.assertExchange).toHaveBeenCalled();
      expect(brockerService.assertQueue).toHaveBeenCalled();
      expect(brockerService.bindToQueue).toHaveBeenCalled();
      expect(brockerService.receiveMessage).not.toHaveBeenCalled();
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
    });
  });
});
