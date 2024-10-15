import { Controller } from '@nestjs/common';
import { TextsService } from './texts.service';

@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) {}
}
