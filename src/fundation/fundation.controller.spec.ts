import { Test, TestingModule } from '@nestjs/testing';
import { FundationController } from './fundation.controller';

describe('FundationController', () => {
  let controller: FundationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundationController],
    }).compile();

    controller = module.get<FundationController>(FundationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
