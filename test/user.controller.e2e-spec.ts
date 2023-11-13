import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../src/users/user.module';
import { UserService } from '../src/users/user.service';
import { UsersRequestedPublishService } from '../src/users-requested-publish/users-requested-publish.service';
import { INestApplication } from '@nestjs/common';
import { mockUsers, mockUserPublish, mockUserService } from '../__mock__';

describe(' UserController e2e', () => {
  let app: INestApplication;
  let userService: jest.Mocked<UserService>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(UsersRequestedPublishService)
      .useValue(mockUserPublish)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('/test');
    await app.init();
    userService = moduleRef.get(UserService);
  });

  describe('users request', () => {
    beforeEach(() => {
      userService.getUsers.mockResolvedValue(mockUsers);
    });

    it('/GET users', () => {
      return request(app.getHttpServer())
        .get('/test/users')
        .expect(200)
        .expect(mockUsers);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
