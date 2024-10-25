import { Controller, Get, Param } from '@nestjs/common';
import { AliAffiliateService } from './ali-affiliate.service';

@Controller('api/ali-affiliate')
export class AliAffiliateController {
  constructor(private aliAffiliateService: AliAffiliateService) {}

  @Get(':keyword')
  async getAliProductInfos(@Param('keyword') keyword: string) {
    return this.aliAffiliateService.getAliProductInfos(keyword);
  }
}
