import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScreenshotsModule } from './screenshots/screenshots.module';
import { TextsModule } from './texts/texts.module';
import { ProductInfosModule } from './product-infos/product-infos.module';
import { CoupangPartnersModule } from './coupang-partners/coupang-partners.module';
import { AliAffiliateModule } from './ali-affiliate/ali-affiliate.module';
import { PuppeteerEngineModule } from './puppeteer-engine/puppeteer-engine.module';

@Module({
  imports: [ScreenshotsModule, TextsModule, ProductInfosModule, CoupangPartnersModule, AliAffiliateModule, PuppeteerEngineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
