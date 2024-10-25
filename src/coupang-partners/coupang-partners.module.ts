import { Module } from '@nestjs/common';
import { PuppeteerEngineModule } from 'src/puppeteer-engine/puppeteer-engine.module';
import { CoupangPartnersController } from './coupang-partners.controller';
import { CoupangPartnersService } from './coupang-partners.service';

@Module({
  imports: [PuppeteerEngineModule],
  controllers: [CoupangPartnersController],
  providers: [CoupangPartnersService],
})
export class CoupangPartnersModule {}
