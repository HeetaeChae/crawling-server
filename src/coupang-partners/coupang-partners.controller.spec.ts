import { Test, TestingModule } from '@nestjs/testing';
import { CoupangPartnersController } from './coupang-partners.controller';

describe('CoupangPartnersController', () => {
  let controller: CoupangPartnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoupangPartnersController],
    }).compile();

    controller = module.get<CoupangPartnersController>(CoupangPartnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
