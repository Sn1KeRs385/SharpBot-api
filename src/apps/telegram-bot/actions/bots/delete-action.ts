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
  const bot = await TgBotRepository.firstOrFail({ id: getBotId(app) })

  await TgBotRepository.remove(bot)

  app.setRedirectRoute(getRouteByName('BotsIndex'))
}
