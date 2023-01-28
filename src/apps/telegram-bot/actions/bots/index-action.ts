import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'
import TgBotRepository from '~apps/shared/repositories/tg-bot-repository'

export default async (app: AppContainer) => {
  const bots = await TgBotRepository.getList({ user_id: app.getUser().id })

  const buttons = bots.map((bot) => {
    return [
      {
        text: `${bot.name} (${bot.username})`,
        callback_data: getRouteByName('BotsEdit').path + ` -botId=${bot.id}`,
      },
    ]
  })

  await app
    .getBot()
    .sendMessage(app.getRequest().getChatId(), 'Управления ботами', {
      reply_markup: {
        inline_keyboard: [
          ...buttons,
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
