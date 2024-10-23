import { Controller, Get, Param } from '@nestjs/common';
import { ProductInfosService } from './product-infos.service';

@Controller('api/product-infos')
export class ProductInfosController {
  constructor(private readonly productInfosService: ProductInfosService) {}

  @Get('coupang/:keyword')
  async getRankedCoupangProductInfos(@Param('keyword') keyword: string) {
    return this.productInfosService.getRankedCoupangProductInfos(keyword);
  }

  @Get('ali/:keyword')
  async getRankedAliProductInfos(@Param('keyword') keyword: string) {
    return this.productInfosService.getRankedAliProductInfos(keyword);
  }
}
