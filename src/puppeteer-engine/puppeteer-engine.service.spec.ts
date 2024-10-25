import { Test, TestingModule } from '@nestjs/testing';
import { PuppeteerEngineService } from './puppeteer-engine.service';

describe('PuppeteerEngineService', () => {
  let service: PuppeteerEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuppeteerEngineService],
    }).compile();

    service = module.get<PuppeteerEngineService>(PuppeteerEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
