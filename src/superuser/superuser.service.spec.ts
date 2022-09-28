import { Test, TestingModule } from '@nestjs/testing';
import { SuperuserService } from './superuser.service';

describe('SuperuserService', () => {
  let service: SuperuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperuserService],
    }).compile();

    service = module.get<SuperuserService>(SuperuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
