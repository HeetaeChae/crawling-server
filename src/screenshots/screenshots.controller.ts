import { Controller, Get, Post, Query } from '@nestjs/common';
import { ScreenshotsService } from './screenshots.service';

@Controller('api/screenshots')
export class ScreenshotsController {
  constructor(private readonly screenshotsService: ScreenshotsService) {}

  @Get('/video')
  async captureVideo(
    @Query('videoUrl') videoUrl: string,
    @Query('count') count: string,
  ) {
    const numberedCount = Number(count);
    return this.screenshotsService.captureVideo(videoUrl, numberedCount);
  }
}
