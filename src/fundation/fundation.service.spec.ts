import { Test, TestingModule } from '@nestjs/testing';
import { FundationService } from './fundation.service';

describe('FundationService', () => {
  let service: FundationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundationService],
    }).compile();

    service = module.get<FundationService>(FundationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
