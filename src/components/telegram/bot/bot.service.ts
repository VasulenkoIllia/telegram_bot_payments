import { Injectable } from '@nestjs/common';
import { Context, Markup, Telegraf } from 'telegraf';
import { InjectBot, On, Start, Update } from 'nestjs-telegraf';

@Injectable()
@Update()
export class BotService {
  private userSelections: Record<
    number,
    { subscription?: string; payment?: string }
  > = {};
  // Масив підписок
  private subscriptions = [
    { name: 'Basic', cost: 10 },
    { name: 'Standard', cost: 20 },
    { name: 'Premium', cost: 30 },
  ];
  // Типи оплати
  private paymentMethods = ['Stars', 'TON', 'Bank'];

  constructor(@InjectBot() private readonly bot: Telegraf) {}

  // Команда /start
  @Start()
  async start(ctx: Context) {
    // Відправляємо меню підписок
    await ctx.reply(
      'Choose your subscription:',
      this.generateSubscriptionKeyboard(),
    );
  }

  // Обробка вибору підписки
  @On('callback_query')
  async handleCallbackQuery(ctx: Context) {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const callbackData = ctx.callbackQuery.data;

      // Обробка вибору підписки
      if (callbackData.startsWith('select_subscription_')) {
        const selectedSubscription = callbackData.replace(
          'select_subscription_',
          '',
        );
        this.saveUserSelection(ctx, { subscription: selectedSubscription });

        await ctx.editMessageText(
          `You selected subscription: ${selectedSubscription}`,
        );
        await ctx.reply(
          'Now, choose your payment method:',
          this.generatePaymentKeyboard(),
        );
      }

      // Обробка вибору типу оплати
      if (callbackData.startsWith('select_payment_')) {
        const selectedPayment = callbackData.replace('select_payment_', '');
        this.saveUserSelection(ctx, { payment: selectedPayment });

        const userSelection = this.userSelections[ctx.from.id];
        await ctx.editMessageText(
          `You selected subscription: ${userSelection.subscription} and payment method: ${selectedPayment}`,
        );
      }

      // Відповідь на callback-запит
      await ctx.answerCbQuery();
    }
  }

  // Генеруємо клавіатуру підписок
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

  // Генеруємо клавіатуру типів оплати
  private generatePaymentKeyboard() {
    return Markup.inlineKeyboard(
      this.paymentMethods.map((method) => [
        Markup.button.callback(method, `select_payment_${method}`),
      ]),
    );
  }

  // Зберігаємо вибір користувача
  private saveUserSelection(
    ctx: Context,
    selection: { subscription?: string; payment?: string },
  ) {
    const userId = ctx.from.id;

    if (!this.userSelections[userId]) {
      this.userSelections[userId] = {};
    }

    if (selection.subscription) {
      this.userSelections[userId].subscription = selection.subscription;
    }

    if (selection.payment) {
      this.userSelections[userId].payment = selection.payment;
    }
  }
}
