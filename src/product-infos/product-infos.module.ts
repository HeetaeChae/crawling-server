import { Module } from '@nestjs/common';
import { ScreenshotsModule } from 'src/screenshots/screenshots.module';
import { ProductInfosController } from './product-infos.controller';
import { ProductInfosService } from './product-infos.service';

@Module({
  imports: [ScreenshotsModule],
  controllers: [ProductInfosController],
  providers: [ProductInfosService],
})
export class ProductInfosModule {}
