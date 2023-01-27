import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'
import * as TgBotRepository from '~apps/shared/repositories/tg-bot-repository'
import * as TgBotService from '~apps/shared/services/tg-bot-service'

const getBotId = (app: AppContainer): number => {
  const botId = app.getRequest().getParam('botId')

  if (!botId || !parseInt(botId.toString())) {
    throw new Error('Идентификатор бота не найден')
  }

  return parseInt(botId.toString())
}
export default async (app: AppContainer) => {
  const bot = await TgBotRepository.findOrFail({
    id: getBotId(app),
  })

  await TgBotService.deleteBot(bot)

  app.setRedirectRoute(getRouteByName('BotsIndex'))
}
