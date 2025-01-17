import { Injectable } from '@nestjs/common';
import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegrafConfigService implements TelegrafOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTelegrafOptions(): TelegrafModuleOptions {
    const token = this.configService.get<string>('bot.token');
    if (!token) {
      throw new Error('Telegram Bot token is not defined in the configuration');
    }

    return {
      token,
    };
  }
}
