import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { InjectBot, On, Update } from 'nestjs-telegraf';

@Injectable()
@Update()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf) {}

  @On('callback_query')
  async handleCallbackQuery(ctx: Context) {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const callbackData = ctx.callbackQuery.data; // Now safely accessing `data`
      if (callbackData === 'test_callback') {
        console.log('Callback action triggered!');
        await ctx.answerCbQuery('You clicked the Test button!');
      }
    } else {
      console.log('CallbackQuery does not contain data.');
    }
  }

  @On('text')
  async handleText(ctx: Context) {
    if (ctx.message && 'text' in ctx.message) {
      await ctx.reply(`You said: ${ctx.message.text}`);
    }
  }

  async start(ctx: Context) {
    await ctx.reply('Welcome! Here is a test button:', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Test',
              callback_data: 'test_callback',
            },
          ],
        ],
      },
    });
  }
}
