import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { MyContext } from '../../../common/interfaces/telegram/my-context.interface';
import QRCode from 'qrcode';
import * as fs from 'fs';
import { isTelegramUrl } from '@tonconnect/sdk';
import {
  addTGReturnStrategy,
  buildUniversalKeyboard,
} from '../../../common/utils/ton-utils';
import * as process from 'process';
import { getWalletInfo, getWallets } from './ton-connect/wallets';
import { getConnector } from './ton-connect/connector';

@Injectable()
export class WalletService {
  constructor(@InjectBot() private readonly bot: Telegraf<MyContext>) {}

  async handleWalletCommand(ctx: MyContext, text: string) {
    if (text === 'Гаманці') {
      console.log(1);
      await ctx.reply('Оберіть гаманець:', {
        reply_markup: {
          inline_keyboard: this.getWalletKeyboard(), // Pass it as an inline_keyboard property
        },
      });
    } else {
      await ctx.reply('Невідома команда для гаманців.');
    }
  }

  getWalletKeyboard() {
    console.log(2);
    return [
      [
        {
          text: 'Оберіть гаманець',
          callback_data: JSON.stringify({ method: 'chose_wallet' }),
        },
        {
          text: 'Показати QR',
          callback_data: JSON.stringify({ method: 'universal_qr' }),
        },
      ],
    ];
  }

  async handleWalletCallback(ctx: MyContext, callbackData: string) {
    const query = ctx.callbackQuery;
    const data = JSON.parse(callbackData);

    switch (data.method) {
      case 'chose_wallet':
        await this.onChooseWalletClick(query);
        break;
      case 'select_wallet':
        await this.onWalletClick(query, data.data);
        break;
      case 'universal_qr':
        await this.onOpenUniversalQRClick(query);
        break;
    }
  }

  private async onChooseWalletClick(query: any): Promise<void> {
    const wallets = await getWallets();

    await this.bot.telegram.editMessageReplyMarkup(
      query.message.chat.id,
      query.message.message_id,
      undefined,
      {
        inline_keyboard: [
          wallets.map((wallet) => ({
            text: wallet.name,
            callback_data: JSON.stringify({
              method: 'select_wallet',
              data: wallet.appName,
            }),
          })),
          [
            {
              text: '« Back',
              callback_data: JSON.stringify({
                method: 'universal_qr',
              }),
            },
          ],
        ],
      },
    );
  }

  private async onOpenUniversalQRClick(query: any): Promise<void> {
    const chatId = query.message.chat.id;
    const wallets = await getWallets();
    const connector = getConnector(chatId);
    const link = connector.connect(wallets);

    await this.editQR(query.message, link);
    const keyboard = await buildUniversalKeyboard(link, wallets);

    await this.bot.telegram.editMessageReplyMarkup(
      chatId,
      query.message.message_id,
      undefined,
      {
        inline_keyboard: keyboard,
      },
    );
  }

  private async onWalletClick(query: any, data: string): Promise<void> {
    console.log('in wallet');
    const chatId = query.message.chat.id;
    const connector = getConnector(chatId);
    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
      return;
    }

    let buttonLink = connector.connect({
      bridgeUrl: selectedWallet.bridgeUrl,
      universalLink: selectedWallet.universalLink,
    });

    let qrLink = buttonLink;
    if (isTelegramUrl(selectedWallet.universalLink)) {
      buttonLink = addTGReturnStrategy(
        buttonLink,
        process.env.TELEGRAM_BOT_LINK!,
      );
      qrLink = addTGReturnStrategy(qrLink, 'none');
    }

    await this.editQR(query.message, qrLink);

    console.log('selectedWallet: ', selectedWallet);
    console.log('////////////********/////');
    console.log('buttonLink: ', buttonLink);

    await this.bot.telegram.editMessageReplyMarkup(
      chatId,
      query.message.message_id,
      undefined,
      {
        inline_keyboard: [
          [
            {
              text: '« Back',
              callback_data: JSON.stringify({ method: 'chose_wallet' }),
            },
            { text: `Open ${selectedWallet.name}`, url: buttonLink },
          ],
        ],
      },
    );
  }

  private async editQR(message: any, link: string): Promise<void> {
    const fileName = 'QR-code-' + Math.round(Math.random() * 10000000000);

    // Генерація QR-коду та збереження у файл
    await QRCode.toFile(`./qr/${fileName}`, link);

    // Завантаження QR-коду в Telegram і отримання file_id
    const uploadedPhoto = await this.bot.telegram.sendPhoto(message.chat.id, {
      source: `./qr/${fileName}`,
    });
    const fileId = uploadedPhoto.photo[0].file_id; // Отримуємо file_id першого фото

    // Редагування повідомлення за допомогою file_id
    console.log('check media');
    await this.bot.telegram.editMessageMedia(
      message.chat.id, // chatId
      message.message_id, // messageId
      '', // inlineMessageId (не використовується тут)
      {
        type: 'photo',
        media: fileId,
        caption: 'Your QR code here!', // Додайте ваш підпис
      },
    );

    // Видалення тимчасового файлу з диску
    await new Promise((r) => fs.rm(`./qr/${fileName}`, r));
  }
}
