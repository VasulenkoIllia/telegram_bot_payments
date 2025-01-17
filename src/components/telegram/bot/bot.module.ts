import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import botConfig from './bot.config';
import { TelegrafConfigService } from './telegraf-config.service';
import { BotService } from './bot.service';
import { session } from 'telegraf';

@Module({
  imports: [
    ConfigModule.forFeature(botConfig),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TelegrafConfigService, // Підключає кастомний конфігураційний сервіс
    }),
  ],
  providers: [BotService],
  exports: [TelegrafModule],
})
export class BotModule {
  constructor(private readonly botService: BotService) {
    botService.bot.use(session()); // Додаємо middleware сесій
  }
}
