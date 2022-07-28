import { Test, TestingModule } from '@nestjs/testing';
import { DealershipService } from './dealership.service';

describe('DealershipService', () => {
  let service: DealershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DealershipService],
    }).compile();

    service = module.get<DealershipService>(DealershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
