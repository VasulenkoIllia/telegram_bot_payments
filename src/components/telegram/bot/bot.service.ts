import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { MyContext } from '../../../common/interfaces/telegram/my-context.interface';
import { SubscriptionService } from './subscription/subscription.service';

@Injectable()
@Update()
export class BotService {
  constructor(
    @InjectBot() readonly bot: Telegraf<MyContext>,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Start()
  async start(ctx: MyContext) {
    ctx.session = {
      profileStep: undefined,
      profile: undefined,
      subscription: undefined,
      paymentMethod: undefined,
    }; // Очищаємо сесію при старті

    await ctx.reply('Вітаємо! Оберіть опцію:', {
      reply_markup: {
        keyboard: [['Профіль', 'Інфо', 'Підписка']],
        resize_keyboard: true,
      },
    });
  }

  @On('text')
  async handleText(ctx: MyContext) {
    const message = ctx.message;

    if (message && 'text' in message) {
      const text = message.text;
      switch (text) {
        case 'Профіль':
          await ctx.reply('Ваш профіль: ...');
          break;
        case 'Інфо':
          await ctx.reply('Це бот для вибору підписок і оплати.');
          break;
        case 'Підписка':
          await ctx.reply(
            'Оберіть підписку:',
            this.subscriptionService.getSubscriptionKeyboard(),
          );
          break;
        default:
          await ctx.reply('Будь ласка, оберіть опцію з меню.');
      }
    } else {
      console.log('Повідомлення не містить тексту.');
    }
  }

  @On('callback_query')
  async handleCallbackQuery(ctx: MyContext) {
    const callbackQuery = ctx.callbackQuery;

    if ('data' in callbackQuery) {
      const callbackData = callbackQuery.data;

      if (callbackData.startsWith('select_subscription_')) {
        const selectedSubscription = callbackData.replace(
          'select_subscription_',
          '',
        );
        await this.subscriptionService.handleSubscriptionSelection(
          ctx,
          selectedSubscription,
        );
      }

      if (callbackData.startsWith('select_payment_')) {
        const selectedPayment = callbackData.replace('select_payment_', '');
        await this.subscriptionService.handlePaymentSelection(
          ctx,
          selectedPayment,
        );
      }

      await ctx.answerCbQuery(); // Завершення callback-запиту
    }
  }
}
