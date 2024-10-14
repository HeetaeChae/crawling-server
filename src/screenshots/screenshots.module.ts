import { Module } from '@nestjs/common';
import { ScreenshotsController } from './screenshots.controller';
import { ScreenshotsService } from './screenshots.service';

@Module({
  controllers: [ScreenshotsController],
  providers: [ScreenshotsService],
})
export class ScreenshotsModule {}
