import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'

export default async (app: AppContainer) => {
  await app
    .getBot()
    .sendMessage(app.getMessage().chat.id, 'Управления ботами', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Добавить бота',
              callback_data: getRouteByName('BotsAdd').path,
            },
          ],
          [
            {
              text: 'Назад',
              callback_data: getRouteByName('InitStart').path,
            },
          ],
        ],
      },
    })
}
