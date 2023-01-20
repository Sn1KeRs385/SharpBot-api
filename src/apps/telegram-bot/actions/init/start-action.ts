import AppContainer from '~apps/telegram-bot/infrastructure/app-container'

export default async (app: AppContainer) => {
  await app
    .getBot()
    .sendMessage(app.getMessage().chat.id, 'Выберите пункт меню', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Управления ботами',
              callback_data: '/bots',
            },
          ],
        ],
      },
    })
}
