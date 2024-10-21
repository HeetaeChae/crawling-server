import { Controller, Get } from '@nestjs/common';
import { TextsService } from './texts.service';

@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) {}

  @Get('coupang-item-name/:keyword')
  async getCoupangItemName() {}

  @Get('coupang-item-price/:keyword')
  async getCoupangItemPrice() {}

  @Get('coupang-item-reviews/:keyword')
  async getCoupangItemReviews() {}
}
