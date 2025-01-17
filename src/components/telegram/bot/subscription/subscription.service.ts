import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { Subscription } from './subscription.types';
import { MyContext } from '../../../../common/interfaces/telegram/my-context.interface';

@Injectable()
export class SubscriptionService {
  private subscriptions: Subscription[] = [
    { name: 'Basic', cost: 10 },
    { name: 'Standard', cost: 20 },
    { name: 'Premium', cost: 30 },
  ];

  private paymentMethods = ['Stars', 'TON', 'Bank'];

  getSubscriptionKeyboard() {
    return Markup.inlineKeyboard(
      this.subscriptions.map((subs) => [
        Markup.button.callback(
          `${subs.name} - ${subs.cost}$`,
          `select_subscription_${subs.name}`,
        ),
      ]),
    );
  }

  getPaymentKeyboard() {
    return Markup.inlineKeyboard(
      this.paymentMethods.map((method) => [
        Markup.button.callback(method, `select_payment_${method}`),
      ]),
    );
  }

  async handleSubscriptionSelection(ctx: MyContext, subscription: string) {
    const selectedSubscription = this.findSubscription(subscription);

    if (!selectedSubscription) {
      await ctx.reply('Обрана підписка не знайдена.');
      return;
    }

    ctx.session.subscription = selectedSubscription.name; // Зберігаємо вибір підписки

    // Видаляємо повідомлення з вибором підписки
    if (ctx.callbackQuery?.message?.message_id) {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    }

    // Відправляємо повідомлення з вибраною підпискою
    await ctx.reply(
      `Ви обрали підписку: <b>${selectedSubscription.name} (${selectedSubscription.cost}$).</b>`,
      { parse_mode: 'HTML' },
    );

    // Відправляємо повідомлення з вибором способу оплати
    await ctx.reply('Оберіть спосіб оплати:', this.getPaymentKeyboard());
  }

  async handlePaymentSelection(ctx: MyContext, paymentMethod: string) {
    const subscriptionName = ctx.session.subscription;

    if (!subscriptionName) {
      await ctx.reply('Будь ласка, спочатку оберіть підписку.');
      return;
    }

    const selectedSubscription = this.findSubscription(subscriptionName);

    if (!selectedSubscription) {
      await ctx.reply('Підписка не знайдена.');
      return;
    }

    ctx.session.paymentMethod = paymentMethod; // Зберігаємо спосіб оплати

    // Видаляємо повідомлення з вибором способу оплати
    if (ctx.callbackQuery?.message?.message_id) {
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    }

    // Відправляємо підтвердження
    await ctx.reply(
      `Ви обрали підписку: <b>${selectedSubscription.name} (${selectedSubscription.cost}$)</b> і спосіб оплати: <b>${paymentMethod}</b>.`,
      { parse_mode: 'HTML' },
    );
  }

  private findSubscription(name: string): Subscription | undefined {
    return this.subscriptions.find((subs) => subs.name === name);
  }
}
