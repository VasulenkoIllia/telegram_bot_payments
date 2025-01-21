import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { MyContext } from '../../../common/interfaces/telegram/my-context.interface';
import { SubscriptionService } from './subscription/subscription.service';
import { ProfileService } from './profile/profile.service';
import { message } from 'telegraf/filters';
import { WalletService } from '../../payments/ton/wallet.service';

@Injectable()
@Update()
export class BotService {
  constructor(
    @InjectBot() readonly bot: Telegraf<MyContext>,
    private readonly subscriptionService: SubscriptionService,
    private readonly profileService: ProfileService,
    private readonly walletService: WalletService,
  ) {}

  @Start()
  async start(ctx: MyContext) {
    // Очищаємо сесію при старті
    ctx.session = {
      previousMessageId: undefined,
      profileStep: undefined,
      profile: undefined,
      subscription: undefined,
      paymentMethod: undefined,
    };

    await ctx.reply('Вітаємо! Оберіть опцію:', {
      reply_markup: {
        keyboard: [['Профіль', 'Інфо', 'Підписка', 'Гаманці']],
        resize_keyboard: true,
      },
    });
  }

  @On('text')
  async handleText(ctx: MyContext) {
    // Перевіряємо, чи активний етап збору профілю
    if (ctx.session.profileStep) {
      // Якщо активний етап збору профілю, продовжуємо обробку
      await this.profileService.handleProfileData(ctx);
    } else {
      // Якщо профіль не заповнюється, обробляємо інші команди
      const message = ctx.message;

      if (message && 'text' in message) {
        const text = message.text;
        switch (text) {
          case 'Профіль':
            // Викликаємо метод з ProfileService для обробки профілю
            await this.profileService.handleProfile(ctx);
            break;
          case 'Інфо':
            await ctx.reply(
              'Це бот для вибору підписок і оплати. Використовуйте меню для навігації.',
            );
            break;
          case 'Підписка':
            await ctx.reply(
              'Оберіть підписку:',
              this.subscriptionService.getSubscriptionKeyboard(),
            );
            break;
          case 'Гаманці':
            await this.walletService.handleWalletCommand(ctx, text);
            break;
          default:
            await ctx.reply('Будь ласка, оберіть опцію з меню.');
        }
      } else {
        console.log('Повідомлення не містить тексту.');
      }
    }
  }

  @On('message')
  async handleContact(ctx: MyContext) {
    // Перевірка, чи повідомлення містить контакт
    if (ctx.has(message('contact'))) {
      const contact = ctx.message.contact;
      const phoneNumber = contact.phone_number; // Отримуємо номер телефону користувача

      console.log('Received phone number:', phoneNumber);

      // Збереження номера телефону у сесії
      ctx.session.profile = ctx.session.profile || {};
      ctx.session.profile.phone = phoneNumber;

      // Відповідь користувачу
      await ctx.reply(`Дякуємо! Ваш номер телефону: ${phoneNumber}`, {
        reply_markup: {
          remove_keyboard: true, // Закриваємо клавіатуру
        },
      });

      await ctx.reply('Оберіть опцію:', {
        reply_markup: {
          keyboard: [['Профіль', 'Інфо', 'Підписка']],
          resize_keyboard: true, // Підлаштовує клавіатуру під розмір екрану
        },
      });

      // Відображення всього профілю користувача
      const profile = ctx.session.profile;
      const { fullName, city } = profile || {};
      const profileMessage = `
        Ваш профіль:
        ФІО: ${fullName || 'Не вказано'}
        Місто: ${city || 'Не вказано'}
        Телефон: ${phoneNumber}
      `;

      await ctx.reply(profileMessage, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Так, все вірно', callback_data: 'profile_confirm' }],
            [{ text: 'Змінити', callback_data: 'profile_reset' }],
          ],
        },
      });
    } else {
      // Якщо не отримано контакт, можна додати додаткову логіку
      console.log('Не отримано контакт.');
    }
  }

  @On('callback_query')
  async handleCallbackQuery(ctx: MyContext) {
    const callbackQuery = ctx.callbackQuery;

    if ('data' in callbackQuery) {
      const callbackData = callbackQuery.data;

      // Обробка вибору підписки (Subscription handling)
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

      // Обробка вибору методу оплати (Payment method handling)
      if (callbackData.startsWith('select_payment_')) {
        const selectedPayment = callbackData.replace('select_payment_', '');
        await this.subscriptionService.handlePaymentSelection(
          ctx,
          selectedPayment,
        );
      }
      console.log(callbackData);
      // Обробка для гаманців (Wallet handling)
      if (
        callbackData.includes('chose_wallet') ||
        callbackData.includes('select_wallet') ||
        callbackData.includes('universal_qr')
      ) {
        console.log(3);
        await this.walletService.handleWalletCallback(ctx, callbackData);
      }

      // Обробка підтвердження або скидання профілю (Profile confirmation or reset)
      if (
        callbackData === 'profile_confirm' ||
        callbackData === 'profile_reset'
      ) {
        await this.profileService.handleProfileConfirmation(ctx, callbackData);
      }
    }

    // Відповідь на callback запит, щоб зняти стан "loading" з кнопок
    await ctx.answerCbQuery();
  }
}
