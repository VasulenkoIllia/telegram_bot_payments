import { Module } from "@nestjs/common";
import { AppConfig } from "./app-config.infrastructure";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ConfigService, AppConfig],
  exports: [AppConfig]
})
export class AppConfigInfrastructureModule {}
