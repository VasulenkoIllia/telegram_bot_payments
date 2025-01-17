import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { BotService } from './bot.service';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
  ],
  providers: [BotService, SubscriptionService],
})
export class BotModule {
  constructor(private readonly botService: BotService) {
    this.botService.bot.use(session()); // Підключаємо сесії
  }
}
