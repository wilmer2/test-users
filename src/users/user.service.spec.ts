import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import {
  mockUsers,
  mockUserResponse,
  mockUserPublish,
  mockUsersPair,
  mockUserRepository,
} from '../../__mock__';
import { UsersRequestedPublishService as UserPublishService } from '../users-requested-publish/users-requested-publish.service';
import { UserRepository } from './user.repository';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let userPublishService: jest.Mocked<UserPublishService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [UserService, UserRepository, UserPublishService],
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .overrideProvider(UserPublishService)
      .useValue(mockUserPublish)
      .compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    userPublishService = module.get(UserPublishService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#getUsers()', () => {
    beforeEach(() => {
      userRepository.getUsers.mockResolvedValue(mockUserResponse);
    });

    it('should call the get method of the HTTP service', async () => {
      await service.getUsers();
      expect(userRepository.getUsers).toHaveBeenCalled();
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

  describe('#publish()', () => {
    it('should call publishUser', async () => {
      await service.publishUsersWithEvenId(mockUsers);
      expect(userPublishService.publishUsers).toHaveBeenCalledWith(
        mockUsersPair,
      );
    });
  });
});
