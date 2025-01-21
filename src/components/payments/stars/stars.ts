import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MyContext } from '../../../common/interfaces/telegram/my-context.interface';

@Injectable()
export class StarsService {
  async sendInvoice(ctx: MyContext, chatId: number) {
    const amount = 100; // Сума у центрах (1.00 USD = 100)
    const product = 'Premium-version';
    const payload = randomUUID();

    try {
      await ctx.telegram.sendInvoice(chatId, {
        currency: 'USD',
        prices: [{ label: product, amount }],
        title: product,
        provider_token: process.env.PROVIDER_TOKEN || '', // Токен провайдера
        description: `Отримайте преміум-версію вже зараз!`,
        payload, // Унікальний ідентифікатор для інвойсу
        photo_url:
          'https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Original_Doge_meme.jpg/220px-Original_Doge_meme.jpg',
        photo_width: 500,
        photo_height: 500,
        start_parameter: 'no_pay',
      });
    } catch (e) {
      console.error('Error sending invoice:', e.message);
      await ctx.reply('Не вдалося створити інвойс. Спробуйте пізніше.');
    }
  }

  async onPreCheckout(ctx: MyContext) {
    const { id } = ctx.preCheckoutQuery;

    try {
      // Telegram вимагає відповісти на pre_checkout_query
      await ctx.telegram.answerPreCheckoutQuery(id, true);
    } catch (e) {
      console.error('Pre-checkout error:', e.message);
      await ctx.telegram.answerPreCheckoutQuery(id, false, e.message);
    }
  }

  async onSuccesssfullPayment(ctx: MyContext) {
    // Перевірка, чи повідомлення містить successful_payment
    if ('successful_payment' in ctx.message) {
      const successfulPayment = ctx.message.successful_payment;

      try {
        // Надсилаємо повідомлення про успішну оплату
        await ctx.reply(
          `Дякуємо за оплату! Ви придбали продукт на суму ${
            successfulPayment.total_amount / 100
          } USD.`,
        );
      } catch (e) {
        console.error('Error processing successful payment:', e.message);
        await ctx.reply('Сталася помилка під час обробки платежу.');
      }
    } else {
      // Якщо повідомлення не містить successful_payment
      console.error('No successful payment found in the update.');
      await ctx.reply('Сталася помилка. Інформація про платіж недоступна.');
    }
  }
}
