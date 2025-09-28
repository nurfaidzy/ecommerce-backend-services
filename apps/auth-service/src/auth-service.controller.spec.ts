import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceController } from '../src/auth-service.controller';
import { AuthServiceService } from '../src/auth-service.service';

describe('AuthServiceController', () => {
  let controller: AuthServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthServiceController],
      providers: [
        {
          provide: AuthServiceService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            getProfile: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthServiceController>(AuthServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
