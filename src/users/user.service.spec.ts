import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { usersMock } from '../../__mock__/user.mock';
import { USER_EXCHANGE } from '../common/constants';

describe('UserService', () => {
  let service: UserService;
  let httpMock: jest.Mocked<AxiosAdapter>;
  let broker: jest.Mocked<RabbitMqAdapter>;

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
          useFactory: () => ({
            connect: jest.fn(),
            createChannel: jest.fn(),
            assertExchange: jest.fn(),
            assertQueue: jest.fn(),
            bindToQueue: jest.fn(),
            publish: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    httpMock = module.get(AxiosAdapter);
    broker = module.get(RabbitMqAdapter);
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
      broker.publish.mockClear();
    });

    it('should call the publish method of the broken', async () => {
      await service.publishUsers(usersMock);
      expect(broker.publish).toHaveBeenCalled();
    });

    it('Should be called with the correct parameters', async () => {
      await service.publishUsers(usersMock);

      const expectedOrder = usersMock.filter((user) => user.id % 2 === 0);

      expect(broker.publish).toHaveBeenCalledWith(
        USER_EXCHANGE,
        '',
        expectedOrder,
      );
    });
  });
});
