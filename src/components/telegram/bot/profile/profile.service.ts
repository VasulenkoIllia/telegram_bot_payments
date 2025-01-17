import { Injectable } from '@nestjs/common';
import { MyContext } from '../../../../common/interfaces/telegram/my-context.interface';

@Injectable()
export class ProfileService {
  async handleProfile(ctx: MyContext) {
    const profile = ctx.session.profile;

    if (profile?.fullName && profile?.city && profile?.phone) {
      // Якщо дані вже є, виводимо їх
      await ctx.reply(
        `Ваш профіль:\n` +
          `ФІО: ${profile.fullName}\n` +
          `Місто: ${profile.city}\n` +
          `Телефон: ${profile.phone}\n\n` +
          `Все вірно?`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Так, все вірно', callback_data: 'profile_confirm' }],
              [{ text: 'Змінити дані', callback_data: 'profile_reset' }],
            ],
          },
        },
      );
    } else {
      // Починаємо запит даних
      ctx.session.profileStep = 'fullName';
      await ctx.reply('Введіть ваше ФІО:');
    }
  }

  async handleProfileData(ctx: MyContext) {
    const profileStep = ctx.session.profileStep;

    // Перевіряємо, чи повідомлення містить текст
    if (!profileStep || !ctx.message || !('text' in ctx.message)) {
      await ctx.reply('Будь ласка, введіть текстове значення.');
      return;
    }

    const text = ctx.message.text; // Тепер TypeScript знає, що text існує

    if (profileStep === 'fullName') {
      ctx.session.profile = { ...ctx.session.profile, fullName: text };
      ctx.session.profileStep = 'city';
      await ctx.reply('Введіть ваше місто:');
    } else if (profileStep === 'city') {
      ctx.session.profile = { ...ctx.session.profile, city: text };
      ctx.session.profileStep = 'phone';
      await ctx.reply('Введіть ваш номер телефону:');
    } else if (profileStep === 'phone') {
      ctx.session.profile = { ...ctx.session.profile, phone: text };
      ctx.session.profileStep = undefined;

      const profile = ctx.session.profile;
      await ctx.reply(
        `Ваш профіль:\n` +
          `ФІО: ${profile.fullName}\n` +
          `Місто: ${profile.city}\n` +
          `Телефон: ${profile.phone}\n\n` +
          `Все вірно?`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Так, все вірно', callback_data: 'profile_confirm' }],
              [{ text: 'Змінити дані', callback_data: 'profile_reset' }],
            ],
          },
        },
      );
    }
  }

  async handleProfileConfirmation(ctx: MyContext, action: string) {
    if (action === 'profile_confirm') {
      await ctx.reply('Ваш профіль збережено.');
    } else if (action === 'profile_reset') {
      ctx.session.profile = undefined;
      await this.handleProfile(ctx);
    }
  }
}
