import { Module } from '@nestjs/common';
import { PuppeteerEngineController } from './puppeteer-engine.controller';
import { PuppeteerEngineService } from './puppeteer-engine.service';

@Module({
  controllers: [PuppeteerEngineController],
  providers: [PuppeteerEngineService],
  exports: [PuppeteerEngineService],
})
export class PuppeteerEngineModule {}
