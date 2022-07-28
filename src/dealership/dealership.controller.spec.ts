import { Test, TestingModule } from '@nestjs/testing';
import { DealershipController } from './dealership.controller';

describe('DealershipController', () => {
  let controller: DealershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DealershipController],
    }).compile();

    controller = module.get<DealershipController>(DealershipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
