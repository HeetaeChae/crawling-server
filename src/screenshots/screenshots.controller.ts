import { Controller, Delete, Get, Param, Query, Res } from '@nestjs/common';
import { ScreenshotsService } from './screenshots.service';
import { Response } from 'express';

@Controller('api/screenshots')
export class ScreenshotsController {
  constructor(private readonly screenshotsService: ScreenshotsService) {}

  @Get('capture/youtube-video')
  async captureYoutubeVideo(
    @Query('url') url: string,
    @Query('count') count: string,
    @Query('title') title: string,
  ) {
    const numberedCount = Number(count);
    return this.screenshotsService.captureYoutubeVideo(
      url,
      numberedCount,
      title,
    );
  }

  @Get('capture/coupang-thumbnail-image')
  async captureCoupangThumbnailImage() {}

  @Get(':screenshotName')
  async getScreenshot(
    @Param('screenshotName') screenshotName: string,
    @Res() res: Response,
  ) {
    const screenshotPath =
      await this.screenshotsService.getScreenshot(screenshotName);
    return res.sendFile(screenshotPath);
  }

  @Delete(':screenshotName')
  async deleteScreenshot(@Param('screenshotName') screenshotName: string) {
    return this.screenshotsService.deleteScreenshot(screenshotName);
  }
}
