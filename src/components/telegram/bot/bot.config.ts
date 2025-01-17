import { registerAs } from '@nestjs/config';

interface BotConfig {
  token: string;
}

export default registerAs('bot', (): BotConfig => {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error('Environment variable TELEGRAM_BOT_TOKEN is not defined');
  }

  return {
    token,
  };
});
