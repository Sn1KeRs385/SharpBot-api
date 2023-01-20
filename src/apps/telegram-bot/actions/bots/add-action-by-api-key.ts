import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'
import IncorrectBotApiKeyError from '~apps/telegram-bot/errors/incorrect-bot-api-key-error'
import TelegramBot from 'node-telegram-bot-api'
import * as TgBotService from '~apps/shared/services/tg-bot-service'

const throwIncorrectBotApiKey = (app: AppContainer) => {
  app.setRedirectRoute(getRouteByName('BotsIndex'))
  throw IncorrectBotApiKeyError
}

export default async (app: AppContainer) => {
  const messageText = app.getMessage().text
  if (!messageText) {
    throwIncorrectBotApiKey(app)
    return
  }

  let botInfo: TelegramBot.User | undefined

  try {
    const bot = new TelegramBot(messageText)
    botInfo = await bot.getMe()
  } catch (error) {
    /* empty */
  }

  if (!botInfo) {
    throwIncorrectBotApiKey(app)
    return
  }

  const name = [botInfo.first_name, botInfo.last_name]
    .filter((text) => !!text)
    .join(' ')

  await TgBotService.updateOrCreate({
    user_id: app.getUser().id,
    api_key: messageText,
    name: name,
    username: botInfo.username || 'bot',
  })

  app.setRedirectRoute(getRouteByName('BotsIndex'))
}
