import { Injectable } from '@nestjs/common';
import { MyContext } from '../../../../common/interfaces/telegram/my-context.interface';
import { Markup } from 'telegraf';

@Injectable()
export class ProfileService {
  private defaultProfile = {
    fullName: '',
    city: '',
    phone: '',
  };

  async handleProfile(ctx: MyContext) {
    // Перевіряємо, чи є вже збережений профіль
    if (ctx.session.profile && ctx.session.profile.fullName) {
      await this.showProfile(ctx);
    } else {
      await this.askForNextField(ctx);
    }
  }

  // Обробка введених даних для профілю (ФІО, місто, телефон)
  async handleProfileData(ctx: MyContext) {
    const profileStep = ctx.session.profileStep;

    if (
      !profileStep ||
      !ctx.message ||
      !('text' in ctx.message) ||
      typeof ctx.message.text !== 'string'
    ) {
      await ctx.reply('Будь ласка, введіть коректне значення.');
      return;
    }

    const text = ctx.message.text.trim();
    ctx.session.profile = ctx.session.profile ?? { ...this.defaultProfile };

    // Зберігаємо ID повідомлення з запитанням
    const currentMessageId = ctx.message.message_id;
    ctx.session.previousMessageId = currentMessageId; // зберігаємо ID попереднього запитання

    switch (profileStep) {
      case 'fullName':
        ctx.session.profile.fullName = text;
        ctx.session.profileStep = 'city'; // Переходимо до наступного кроку
        // Видаляємо попереднє запитання
        if (ctx.session.previousMessageId) {
          await ctx.deleteMessage(ctx.session.previousMessageId); // Видалення старого запитання
        }
        await ctx.reply('Введіть ваше місто:');
        break;
      case 'city':
        ctx.session.profile.city = text;
        ctx.session.profileStep = 'phone';

        // Якщо контакт вже є, пропускаємо цей етап
        if (ctx.session.profile.phone) {
          ctx.session.profileStep = undefined; // Завершуємо збір даних
          await this.finalizeProfile(ctx);
        } else {
          // Видаляємо попереднє запитання
          if (ctx.session.previousMessageId) {
            await ctx.deleteMessage(ctx.session.previousMessageId); // Видалення старого запитання
          }
          // Запитуємо номер телефону
          await ctx.telegram.sendMessage(
            ctx.chat.id,
            'Please share your phone number:',
            {
              parse_mode: 'Markdown',
              reply_markup: {
                one_time_keyboard: true,
                keyboard: [
                  [
                    {
                      text: 'Share Phone Number',
                      request_contact: true, // Запит на номер телефону
                    },
                    {
                      text: 'Cancel', // Кнопка для відміни
                    },
                  ],
                ],
                force_reply: true, // Відправлення кнопок під час відповіді
              },
            },
          );
        }
        break;
      case 'phone':
        ctx.session.profileStep = undefined; // Завершуємо збір даних
        await this.finalizeProfile(ctx);
        break;
    }
  }

  // Обробка підтвердження профілю або скидання даних
  async handleProfileConfirmation(ctx: MyContext, action: string) {
    if (action === 'profile_confirm') {
      // Якщо користувач підтвердив профіль
      await ctx.reply('Ваш профіль збережено.');
      // Можна додати подальшу логіку після збереження профілю
    } else if (action === 'profile_reset') {
      // Якщо користувач хоче змінити дані профілю
      ctx.session.profile = { ...this.defaultProfile };
      ctx.session.profileStep = 'fullName'; // Починаємо знову з ФІО
      await ctx.reply('Введіть ваше ФІО:');
    }
  }

  // Завершення збору профілю
  private async finalizeProfile(ctx: MyContext) {
    const profile = ctx.session.profile;
    await ctx.reply(
      `Ваш профіль:\nФІО: ${profile.fullName}\nМісто: ${profile.city}\nТелефон: ${profile.phone}\n\nВсе вірно?`,
      Markup.inlineKeyboard([
        [{ text: 'Так, все вірно', callback_data: 'profile_confirm' }],
        [{ text: 'Змінити дані', callback_data: 'profile_reset' }],
      ]),
    );
  }

  // Метод для відображення профілю користувача
  private async showProfile(ctx: MyContext) {
    const profile = ctx.session.profile;

    await ctx.reply(
      `Ваш профіль:\n` +
        `ФІО: ${profile.fullName}\n` +
        `Місто: ${profile.city}\n` +
        `Телефон: ${profile.phone}\n\n`,
      Markup.inlineKeyboard([
        // [{ text: 'Так, все вірно', callback_data: 'profile_confirm' }],
        // [{ text: 'Змінити дані', callback_data: 'profile_reset' }],
      ]),
    );
  }

  private async askForNextField(ctx: MyContext) {
    if (!ctx.session.profileStep) {
      ctx.session.profileStep = 'fullName'; // Починаємо з ФІО
      await ctx.reply('Введіть ваше ФІО:');
    } else {
      await this.handleProfileData(ctx); // Продовжуємо збір даних
    }
  }
}
