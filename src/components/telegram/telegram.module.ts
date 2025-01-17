import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { BotModule } from './bot/bot.module';

@Module({
  controllers: [TelegramController],
  providers: [TelegramService],
  imports: [BotModule]
})
export class TelegramModule {}
