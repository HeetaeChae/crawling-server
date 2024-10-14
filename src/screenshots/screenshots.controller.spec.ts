import { Test, TestingModule } from '@nestjs/testing';
import { ScreenshotsController } from './screenshots.controller';

describe('ScreenshotsController', () => {
  let controller: ScreenshotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreenshotsController],
    }).compile();

    controller = module.get<ScreenshotsController>(ScreenshotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
