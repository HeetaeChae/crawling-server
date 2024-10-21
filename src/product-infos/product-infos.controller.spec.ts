import { Test, TestingModule } from '@nestjs/testing';
import { ProductInfosController } from './product-infos.controller';

describe('ProductInfosController', () => {
  let controller: ProductInfosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductInfosController],
    }).compile();

    controller = module.get<ProductInfosController>(ProductInfosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
