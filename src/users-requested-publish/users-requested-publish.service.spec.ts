import { Test, TestingModule } from '@nestjs/testing';
import { UsersRequestedPublishService } from './users-requested-publish.service';
import { usersMock, brokerMock as brokerDataMock } from '../../__mock__';
import { UserBrokerEnum } from '../common/constants';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';

describe('UsersRequestedPublishService', () => {
  let service: UsersRequestedPublishService;
  let brokerMock: jest.Mocked<RabbitMqAdapter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRequestedPublishService,
        {
          provide: RabbitMqAdapter,
          useValue: { ...brokerDataMock },
        },
      ],
    }).compile();

    service = module.get<UsersRequestedPublishService>(
      UsersRequestedPublishService,
    );

    brokerMock = module.get(RabbitMqAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#publishUsers', () => {
    beforeEach(() => {
      brokerMock.publish.mockClear();
    });

    it('should call the publish method of the broken', async () => {
      await service.publishUsers(usersMock);
      expect(brokerMock.publish).toHaveBeenCalled();
    });

    it('Should be called with the correct parameters', async () => {
      await service.publishUsers(usersMock);

      const expectedOrder = usersMock.filter((user) => user.id % 2 === 0);

      expect(brokerMock.publish).toHaveBeenCalledWith(
        UserBrokerEnum.USER_EXCHANGE,
        '',
        expectedOrder,
      );
    });
  });

  describe('#onModuleInit', () => {
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
      expect(brokerMock.receiveMessage).not.toHaveBeenCalled();
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
    });
  });
});
