import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { mockUsers, mockHttp } from '../../__mock__';

describe('UserService', () => {
  let service: UserService;
  let httpService: jest.Mocked<AxiosAdapter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [UserService, AxiosAdapter],
    })
      .overrideProvider(AxiosAdapter)
      .useValue(mockHttp)
      .compile();

    service = module.get<UserService>(UserService);
    httpService = module.get(AxiosAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#getUsers()', () => {
    beforeEach(() => {
      httpService.get.mockResolvedValue(mockUsers);
    });

    it('should call the get method of the HTTP service', async () => {
      await service.getUsers();
      expect(httpService.get).toHaveBeenCalled();
    });

    it('should fetch users', async () => {
      const users = await service.getUsers();

      expect(users.length).toBeGreaterThan(0);
      expect(users.length).toEqual(mockUsers.length);
    });

    it('should be sorted in descending order by id', async () => {
      const users = await service.getUsers();

      expect(users[0].id).toEqual(mockUsers[2].id);
    });
  });
});
