import { Test, TestingModule } from '@nestjs/testing';
import { CoupangPartnersService } from './coupang-partners.service';

describe('CoupangPartnersService', () => {
  let service: CoupangPartnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoupangPartnersService],
    }).compile();

    service = module.get<CoupangPartnersService>(CoupangPartnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
