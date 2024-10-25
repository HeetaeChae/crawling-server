import { Module } from '@nestjs/common';
import { PuppeteerEngineModule } from 'src/puppeteer-engine/puppeteer-engine.module';
import { AliAffiliateController } from './ali-affiliate.controller';
import { AliAffiliateService } from './ali-affiliate.service';

@Module({
  imports: [PuppeteerEngineModule],
  controllers: [AliAffiliateController],
  providers: [AliAffiliateService],
})
export class AliAffiliateModule {}
