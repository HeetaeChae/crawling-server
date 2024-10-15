import { Test, TestingModule } from '@nestjs/testing';
import { TextsController } from './texts.controller';

describe('TextsController', () => {
  let controller: TextsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextsController],
    }).compile();

    controller = module.get<TextsController>(TextsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
