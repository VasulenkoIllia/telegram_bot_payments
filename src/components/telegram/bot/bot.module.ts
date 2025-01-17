import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import botConfig from './bot.config';
import { TelegrafConfigService } from './telegraf-config.service';
import { BotService } from './bot.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule.forFeature(botConfig)],
      useClass: TelegrafConfigService,
    }),
  ],
  exports: [TelegrafModule],
  providers: [BotService],
})
export class BotModule implements OnModuleInit {
  async onModuleInit() {
    console.log('BotModule initialized');
  }
}
