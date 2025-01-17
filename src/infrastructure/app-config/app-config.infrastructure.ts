import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

@Injectable()
export class AppConfig {
  constructor(private readonly configService: ConfigService) {}

  public get BASE_SITE_URL(): string {
    return this.configService.get<string>('BASE_SITE_URL');
  }

  public get DB_HOST(): string {
    return this.configService.get<string>('DB_HOST');
  }

  public get DB_PORT(): number {
    return this.configService.get<number>('DB_PORT');
  }

  public get DB_USERNAME(): string {
    return this.configService.get<string>('DB_USERNAME');
  }

  public get DB_PASSWORD(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }

  public get DB_NAME(): string {
    return this.configService.get<string>('DB_NAME');
  }

  public get DB_SYNCHRONIZE(): boolean {
    return this.configService.get<boolean>('DB_SYNCHRONIZE');
  }

  public get PORT(): number {
    return this.configService.get<number>('PORT');
  }

  public get ACCESS_TOKEN_SECRET(): string {
    return this.configService.get<string>('ACCESS_TOKEN_SECRET');
  }

  public get ACCESS_TOKEN_EXPIRES(): string {
    return this.configService.get<string>('ACCESS_TOKEN_EXPIRES');
  }

  public get REFRESH_TOKEN_SECRET(): string {
    return this.configService.get<string>('REFRESH_TOKEN_SECRET');
  }

  public get REFRESH_TOKEN_EXPIRES(): string {
    return this.configService.get<string>('REFRESH_TOKEN_EXPIRES');
  }

  public get RESET_PASSWORD_TOKEN_SECRET(): string {
    return this.configService.get<string>('RESET_PASSWORD_TOKEN_SECRET');
  }

  public get RESET_PASSWORD_TOKEN_EXPIRES(): string {
    return this.configService.get<string>('RESET_PASSWORD_TOKEN_EXPIRES');
  }

  public get INVITE_TOKEN_SECRET(): string {
    return this.configService.get<string>('INVITE_TOKEN_SECRET');
  }

  public get INVITE_TOKEN_EXPIRES(): string {
    return this.configService.get<string>('INVITE_TOKEN_EXPIRES');
  }

  public get REDIS_HOST(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  public get REDIS_PORT(): string {
    return this.configService.get<string>('REDIS_PORT');
  }

  // SMTP variables
  public get SMTP_HOST(): string {
    return this.configService.get<string>('SMTP_HOST');
  }

  public get SMTP_PORT(): number {
    return this.configService.get<number>('SMTP_PORT');
  }

  public get SMTP_USE_SSL(): boolean {
    return this.configService.get<boolean>('SMTP_USE_SSL');
  }

  public get SMTP_USER_NAME(): string {
    return this.configService.get<string>('SMTP_USER_NAME');
  }

  public get SMTP_PASSWORD(): string {
    return this.configService.get<string>('SMTP_PASSWORD');
  }

  public get SMTP_SENDER_EMAIL(): string {
    return this.configService.get<string>('SMTP_SENDER_EMAIL');
  }

  public get LOGGER_LEVEL_SECURITY(): string {
    return this.configService.get<string>('LOGGER_LEVEL_SECURITY');
  }

  public get LOGGER_HIDE_VALUES(): string {
    return this.configService.get<string>('LOGGER_HIDE_VALUES');
  }

  public get LOGGER_LEVEL(): string {
    return this.configService.get<string>('LOGGER_LEVEL');
  }

  public get BUILD_VERSION(): string {
    return this.configService.get<string>('BUILD_VERSION');
  }

  public get PROJECT_NAME(): string {
    return this.configService.get<string>('PROJECT_NAME');
  }

  public get TELEGRAM_API_TOKEN(): string {
    return this.configService.get<string>('TELEGRAM_API_TOKEN');
  }
}

config();
const configService = new ConfigService();
export const appConfigInstance = new AppConfig(configService);
