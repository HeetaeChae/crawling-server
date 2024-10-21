import { Module } from '@nestjs/common';
import { ProductInfosController } from './product-infos.controller';
import { ProductInfosService } from './product-infos.service';

@Module({
  controllers: [ProductInfosController],
  providers: [ProductInfosService]
})
export class ProductInfosModule {}
