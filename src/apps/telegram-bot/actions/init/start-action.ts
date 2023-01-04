import AppContainer from '~apps/telegram-bot/infrastructure/app-container'

export default async (app: AppContainer) => {
  await app
    .getBot()
    .sendMessage(app.getMessage().chat.id, 'Выберите пункт меню', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Button 1',
              callback_data: 'button 1',
            },
            {
              text: 'Button 2',
              callback_data: 'button 2',
            },
          ],
        ],
      },
    })
}
