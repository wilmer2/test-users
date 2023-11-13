import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { usersMock, brokerMock as brokerDataMock } from '../../__mock__';
import { USER_EXCHANGE, USER_QUEUE_REQUEST } from '../common/constants';

describe('UserService', () => {
  let service: UserService;
  let httpMock: jest.Mocked<AxiosAdapter>;
  let brokerMock: jest.Mocked<RabbitMqAdapter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        UserService,
        {
          provide: AxiosAdapter,
          useFactory: () => ({
            get: jest.fn(),
          }),
        },
        {
          provide: RabbitMqAdapter,
          useValue: { ...brokerDataMock },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    httpMock = module.get(AxiosAdapter);
    brokerMock = module.get(RabbitMqAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#getUsers()', () => {
    beforeEach(() => {
      httpMock.get.mockResolvedValue(usersMock);
    });

    it('should call the get method of the HTTP service', async () => {
      await service.getUsers();
      expect(httpMock.get).toHaveBeenCalled();
    });

    it('should fetch users', async () => {
      const users = await service.getUsers();

      expect(users.length).toBeGreaterThan(0);
      expect(users.length).toEqual(usersMock.length);
    });

    it('should be sorted in descending order by id', async () => {
      const users = await service.getUsers();

      expect(users[0].id).toEqual(usersMock[2].id);
    });
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
        USER_EXCHANGE,
        '',
        expectedOrder,
      );
    });
  });

  describe('#onModuleInit', () => {
    it('Should call all its internal methods', async () => {
      await service.onModuleInit();

      expect(brokerMock.connect).toHaveBeenCalled();
      expect(brokerMock.createChannel).toHaveBeenCalled();
      expect(brokerMock.assertExchange).toHaveBeenCalled();
      expect(brokerMock.assertQueue).toHaveBeenCalled();
      expect(brokerMock.bindToQueue).toHaveBeenCalled();
    });
  });

  it('Should call its internal method with the correct parameters', async () => {
    await service.onModuleInit();
    const exchangeType = 'fanout';

    expect(brokerMock.assertExchange).toHaveBeenCalledWith(
      USER_EXCHANGE,
      exchangeType,
    );
    expect(brokerMock.assertQueue).toHaveBeenCalledWith(USER_QUEUE_REQUEST);
    expect(brokerMock.bindToQueue).toHaveBeenCalledWith({
      exchangeName: USER_EXCHANGE,
      queueName: USER_QUEUE_REQUEST,
    });
  });
});
