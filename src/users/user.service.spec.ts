import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { UserService } from './user.service';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { RabbitMqAdapter } from '../common/adapters/rabbitmq.adapter';
import { usersMock } from '../../__mock__/user.mock';

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
});
