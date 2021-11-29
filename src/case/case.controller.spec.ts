import { Test, TestingModule } from '@nestjs/testing';
import { caseController } from './case.controller';

describe('caseController', () => {
  let controller: caseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [caseController],
    }).compile();

    controller = module.get<caseController>(caseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
