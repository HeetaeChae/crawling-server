import { Controller, Delete, Get, Param, Query, Res } from '@nestjs/common';
import { ScreenshotsService } from './screenshots.service';
import { Response } from 'express';

@Controller('api/screenshots')
export class ScreenshotsController {
  constructor(private readonly screenshotsService: ScreenshotsService) {}

  @Get('video/capture')
  async captureVideo(
    @Query('videoUrl') videoUrl: string,
    @Query('count') count: string,
    @Query('title') title: string,
  ) {
    const numberedCount = Number(count);
    return this.screenshotsService.captureVideo(videoUrl, numberedCount, title);
  }

  @Get('video/:imageName')
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = await this.screenshotsService.getImage(imageName);
    return res.sendFile(imagePath);
  }

  @Delete('video/:imageName')
  async deleteImage(@Param('imageName') imageName: string) {
    return this.screenshotsService.deleteImage(imageName);
  }
}
