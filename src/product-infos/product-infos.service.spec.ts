import { Test, TestingModule } from '@nestjs/testing';
import { ProductInfosService } from './product-infos.service';

describe('ProductInfosService', () => {
  let service: ProductInfosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductInfosService],
    }).compile();

    service = module.get<ProductInfosService>(ProductInfosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
