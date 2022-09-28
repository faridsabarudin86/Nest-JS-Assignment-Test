import { Test, TestingModule } from '@nestjs/testing';
import { SuperuserController } from './superuser.controller';

describe('SuperuserController', () => {
  let controller: SuperuserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperuserController],
    }).compile();

    controller = module.get<SuperuserController>(SuperuserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
