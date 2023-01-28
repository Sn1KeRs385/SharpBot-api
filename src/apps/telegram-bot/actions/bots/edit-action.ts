import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'
import TgBotRepository from '~apps/shared/repositories/tg-bot-repository'

const getBotId = (app: AppContainer): number => {
  const botId = app.getRequest().getParam('botId')

  if (!botId || !parseInt(botId.toString())) {
    throw new Error('Идентификатор бота не найден')
  }

  return parseInt(botId.toString())
}

export default async (app: AppContainer) => {
  const bot = await TgBotRepository.firstOrFail({
    id: getBotId(app),
    user_id: app.getUser().id,
  })

  await app
    .getBot()
    .sendMessage(
      app.getRequest().getChatId(),
      `Управления ботом ${bot.name} (${bot.username})`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Удалить бота',
                callback_data:
                  getRouteByName('BotsDelete').path + ` -botId=${bot.id}`,
              },
            ],
            [
              {
                text: 'Назад',
                callback_data: getRouteByName('BotsIndex').path,
              },
            ],
          ],
        },
      }
    )
}
