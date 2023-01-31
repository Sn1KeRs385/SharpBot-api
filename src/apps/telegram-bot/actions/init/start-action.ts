import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'

export default async (app: AppContainer) => {
  await app
    .getBot()
    .sendMessage(app.getRequest().getChatId(), 'Выберите пункт меню', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Управления ботами',
              callback_data: getRouteByName('BotsIndex').path,
            },
            {
              text: 'Управления Каналами',
              callback_data: getRouteByName('ChannelsIndex').path,
            },
          ],
        ],
      },
    })
}
