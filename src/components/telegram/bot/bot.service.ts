import { Injectable } from '@nestjs/common';
import { Markup, Telegraf } from 'telegraf';
import { InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { MyContext } from '../../../common/interfaces/telegram/my-context.interface';

@Injectable()
@Update()
export class BotService {
  private subscriptions = [
    { name: 'Basic', cost: 10 },
    { name: 'Standard', cost: 20 },
    { name: 'Premium', cost: 30 },
  ];

  private paymentMethods = ['Stars', 'TON', 'Bank'];

  constructor(@InjectBot() readonly bot: Telegraf<MyContext>) {}

  @Start()
  async start(ctx: MyContext) {
    ctx.session = {}; // Очищаємо сесію при старті

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

    // Перевіряємо, чи повідомлення містить текст
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
          await this.handleSubscription(ctx); // Перехід до вибору підписки
          break;
        default:
          await ctx.reply('Будь ласка, оберіть опцію з меню.');
      }
    } else {
      console.log('Повідомлення не містить тексту.');
    }
  }

  async handleSubscription(ctx: MyContext) {
    await ctx.reply('Оберіть підписку:', this.generateSubscriptionKeyboard());
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
        ctx.session.subscription = selectedSubscription; // Зберігаємо вибір підписки

        await ctx.editMessageText(
          `Ви обрали підписку: ${selectedSubscription}`,
        );
        await ctx.reply(
          'Оберіть спосіб оплати:',
          this.generatePaymentKeyboard(),
        );
      }

      if (callbackData.startsWith('select_payment_')) {
        const selectedPayment = callbackData.replace('select_payment_', '');
        ctx.session.paymentMethod = selectedPayment; // Зберігаємо вибір способу оплати

        const subscription = ctx.session.subscription ?? 'не вибрано';
        await ctx.reply(
          `Ви обрали підписку: ${subscription} і спосіб оплати: ${selectedPayment}.`,
        );
      }

      await ctx.answerCbQuery(); // Завершення callback-запиту
    }
  }

  private generateSubscriptionKeyboard() {
    return Markup.inlineKeyboard(
      this.subscriptions.map((subs) => [
        Markup.button.callback(
          `${subs.name} - ${subs.cost}$`,
          `select_subscription_${subs.name}`,
        ),
      ]),
    );
  }

  private generatePaymentKeyboard() {
    return Markup.inlineKeyboard(
      this.paymentMethods.map((method) => [
        Markup.button.callback(method, `select_payment_${method}`),
      ]),
    );
  }
}
