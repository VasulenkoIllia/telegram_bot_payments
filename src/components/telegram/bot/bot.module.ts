import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { BotService } from './bot.service';
import { SubscriptionService } from './subscription/subscription.service';
import { ProfileService } from './profile/profile.service';
import { WalletService } from '../../payments/ton/wallet.service';
import { StarsService } from '../../payments/stars/stars';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
      middlewares: [session()], // Додаємо session як middleware
    }),
  ],
  providers: [
    BotService,
    SubscriptionService,
    ProfileService,
    WalletService,
    StarsService,
  ],
})
export class BotModule {}
