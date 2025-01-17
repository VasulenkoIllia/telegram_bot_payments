import { Module } from '@nestjs/common';
import { UserModule } from './components/user/user.module';
import { AuthModule } from './components/auth/auth.module';
import { AppConfigInfrastructureModule } from './infrastructure/app-config/app-config.infrastructure.module';
import { DbInfrastructureModule } from './infrastructure/db/db.infrastructure.module';
import { MappingInfrastructureModule } from './infrastructure/mapping/mapping.infrastructure.module';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './components/telegram/bot/bot.module';
import botConfig from './components/telegram/bot/bot.config';

@Module({
  imports: [
    AppConfigInfrastructureModule,
    DbInfrastructureModule,
    MappingInfrastructureModule.registerProfilesAsync(),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [botConfig],
    }),
    BotModule,
  ],
})
export class AppModule {}
