import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScreenshotsModule } from './screenshots/screenshots.module';
import { TextsModule } from './texts/texts.module';
import { ProductInfosModule } from './product-infos/product-infos.module';

@Module({
  imports: [ScreenshotsModule, TextsModule, ProductInfosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
