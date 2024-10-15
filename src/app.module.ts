import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScreenshotsModule } from './screenshots/screenshots.module';
import { TextsModule } from './texts/texts.module';

@Module({
  imports: [ScreenshotsModule, TextsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
