import { Test, TestingModule } from '@nestjs/testing';
import { AliAffiliateService } from './ali-affiliate.service';

describe('AliAffiliateService', () => {
  let service: AliAffiliateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AliAffiliateService],
    }).compile();

    service = module.get<AliAffiliateService>(AliAffiliateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
