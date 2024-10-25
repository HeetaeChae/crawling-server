import { Test, TestingModule } from '@nestjs/testing';
import { AliAffiliateController } from './ali-affiliate.controller';

describe('AliAffiliateController', () => {
  let controller: AliAffiliateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliAffiliateController],
    }).compile();

    controller = module.get<AliAffiliateController>(AliAffiliateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
