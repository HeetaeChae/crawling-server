import { Test, TestingModule } from '@nestjs/testing';
import { ScreenshotsService } from './screenshots.service';

describe('ScreenshotsService', () => {
  let service: ScreenshotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreenshotsService],
    }).compile();

    service = module.get<ScreenshotsService>(ScreenshotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
