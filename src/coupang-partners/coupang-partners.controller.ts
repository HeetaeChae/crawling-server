import { Controller, Get, Param } from '@nestjs/common';
import { CoupangPartnersService } from './coupang-partners.service';

@Controller('api/coupang-partners')
export class CoupangPartnersController {
  constructor(private coupangPartnersService: CoupangPartnersService) {}

  @Get(':keyword')
  async getRankedCoupangProductInfos(@Param('keyword') keyword: string) {
    return this.coupangPartnersService.getRankedCoupangProductInfos(keyword);
  }
}
