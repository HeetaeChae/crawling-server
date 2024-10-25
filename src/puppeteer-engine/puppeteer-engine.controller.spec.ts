import { Test, TestingModule } from '@nestjs/testing';
import { PuppeteerEngineController } from './puppeteer-engine.controller';

describe('PuppeteerEngineController', () => {
  let controller: PuppeteerEngineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuppeteerEngineController],
    }).compile();

    controller = module.get<PuppeteerEngineController>(PuppeteerEngineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
