// import {
//   CHAIN,
//   isTelegramUrl,
//   toUserFriendlyAddress,
//   UserRejectsError,
// } from '@tonconnect/sdk';
// import { getWalletInfo, getWallets } from './ton-connect/wallets';
// import QRCode from 'qrcode';
// import { getConnector } from './ton-connect/connector';
// // Обробник команди для підключення гаманця
// import { Context } from 'telegraf'; // Імпортуємо InputFile
// import {
//   addTGReturnStrategy,
//   buildUniversalKeyboard,
//   pTimeout,
//   pTimeoutException,
// } from '../../../common/utils/ton-utils';
//
// // Зберігаємо слухачів для підключення
// const newConnectRequestListenersMap = new Map<number, () => void>();
//
// export async function handleConnectCommand(ctx: Context): Promise<void> {
//   const chatId = ctx.chat.id;
//   let messageWasDeleted = false;
//
//   // Очищення старого підключення
//   newConnectRequestListenersMap.get(chatId)?.();
//
//   const connector = getConnector(chatId, () => {
//     unsubscribe();
//     newConnectRequestListenersMap.delete(chatId);
//     deleteMessage();
//   });
//
//   await connector.restoreConnection();
//   if (connector.connected) {
//     const connectedName =
//       (await getWalletInfo(connector.wallet!.device.appName))?.name ||
//       connector.wallet!.device.appName;
//     await ctx.reply(
//       `You have already connected ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
//         connector.wallet!.account.address,
//         connector.wallet!.account.chain === CHAIN.TESTNET,
//       )}\n\n Disconnect wallet first to connect a new one`,
//     );
//     return;
//   }
//
//   const unsubscribe = connector.onStatusChange(async (wallet) => {
//     if (wallet) {
//       await deleteMessage();
//
//       const walletName =
//         (await getWalletInfo(wallet.device.appName))?.name ||
//         wallet.device.appName;
//       await ctx.reply(`${walletName} wallet connected successfully`);
//       unsubscribe();
//       newConnectRequestListenersMap.delete(chatId);
//     }
//   });
//
//   const wallets = await getWallets();
//
//   const link = connector.connect(wallets);
//   const image = await QRCode.toBuffer(link);
//
//   const keyboard = await buildUniversalKeyboard(link, wallets);
//
//   const botMessage = await ctx.replyWithPhoto(
//     { source: image },
//     {
//       reply_markup: {
//         inline_keyboard: keyboard,
//       },
//     },
//   );
//
//   const deleteMessage = async (): Promise<void> => {
//     if (!messageWasDeleted) {
//       messageWasDeleted = true;
//       await ctx.deleteMessage(botMessage.message_id);
//     }
//   };
//
//   newConnectRequestListenersMap.set(chatId, async () => {
//     unsubscribe();
//
//     await deleteMessage();
//
//     newConnectRequestListenersMap.delete(chatId);
//   });
// }
//
// // Обробник команди для відправки транзакції
// export async function handleSendTXCommand(ctx: Context): Promise<void> {
//   const chatId = ctx.chat.id;
//
//   const connector = getConnector(chatId);
//
//   await connector.restoreConnection();
//   if (!connector.connected) {
//     await ctx.reply('Connect wallet to send transaction');
//     return;
//   }
//
//   pTimeout(
//     connector.sendTransaction({
//       validUntil: Math.round(
//         (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) /
//           1000,
//       ),
//       messages: [
//         {
//           amount: '1000000',
//           address:
//             '0:0000000000000000000000000000000000000000000000000000000000000000',
//         },
//       ],
//     }),
//     Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS),
//   )
//     .then(() => {
//       ctx.reply(`Transaction sent successfully`);
//     })
//     .catch((e) => {
//       if (e === pTimeoutException) {
//         ctx.reply(`Transaction was not confirmed`);
//         return;
//       }
//
//       if (e instanceof UserRejectsError) {
//         ctx.reply(`You rejected the transaction`);
//         return;
//       }
//
//       ctx.reply(`Unknown error happened`);
//     })
//     .finally(() => connector.pauseConnection());
//
//   let deeplink = '';
//   const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
//   if (walletInfo) {
//     deeplink = walletInfo.universalLink;
//   }
//
//   if (isTelegramUrl(deeplink)) {
//     const url = new URL(deeplink);
//     url.searchParams.append('startattach', 'tonconnect');
//     deeplink = addTGReturnStrategy(
//       url.toString(),
//       process.env.TELEGRAM_BOT_LINK!,
//     );
//   }
//
//   await ctx.reply(
//     `Open ${
//       walletInfo?.name || connector.wallet!.device.appName
//     } and confirm transaction`,
//     {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: `Open ${
//                 walletInfo?.name || connector.wallet!.device.appName
//               }`,
//               url: deeplink,
//             },
//           ],
//         ],
//       },
//     },
//   );
// }
//
// // Обробник команди для відключення гаманця
// export async function handleDisconnectCommand(ctx: Context): Promise<void> {
//   const chatId = ctx.chat.id;
//
//   const connector = getConnector(chatId);
//
//   await connector.restoreConnection();
//   if (!connector.connected) {
//     await ctx.reply("You didn't connect a wallet");
//     return;
//   }
//
//   await connector.disconnect();
//
//   await ctx.reply('Wallet has been disconnected');
// }
//
// // Обробник команди для показу підключеного гаманця
// export async function handleShowMyWalletCommand(ctx: Context): Promise<void> {
//   const chatId = ctx.chat.id;
//
//   const connector = getConnector(chatId);
//
//   await connector.restoreConnection();
//   if (!connector.connected) {
//     await ctx.reply("You didn't connect a wallet");
//     return;
//   }
//
//   const walletName =
//     (await getWalletInfo(connector.wallet!.device.appName))?.name ||
//     connector.wallet!.device.appName;
//
//   await ctx.reply(
//     `Connected wallet: ${walletName}\nYour address: ${toUserFriendlyAddress(
//       connector.wallet!.account.address,
//       connector.wallet!.account.chain === CHAIN.TESTNET,
//     )}`,
//   );
// }
