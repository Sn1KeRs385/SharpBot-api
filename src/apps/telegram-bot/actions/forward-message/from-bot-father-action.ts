import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import TelegramBot from 'node-telegram-bot-api'
import TgBotRepository from '~apps/shared/repositories/tg-bot-repository'

export default async (app: AppContainer) => {
  const token =
    app
      .getRequest()
      .getMessage()
      ?.text?.match(/[0-9]{9,}:[A-Za-z0-9-]+/g)?.[0] || ''

  if (!token) {
    await app
      .getBot()
      .sendMessage(
        app.getRequest().getChatId(),
        'Не удалось определить ключ бота'
      )
    return
  }

  let botInfo: TelegramBot.User | undefined

  try {
    const bot = new TelegramBot(token)
    botInfo = await bot.getMe()
  } catch (error) {
    /* empty */
  }

  if (!botInfo) {
    await app
      .getBot()
      .sendMessage(
        app.getRequest().getChatId(),
        'По найденному ключу не удалось получить информацию о боте'
      )
    return
  }

  const name = [botInfo.first_name, botInfo.last_name]
    .filter((text) => !!text)
    .join(' ')

  await TgBotRepository.updateOrCreate(
    { user_id: app.getUser().id, api_key: token },
    { name: name, username: botInfo.username || 'bot' }
  )

  await app
    .getBot()
    .sendMessage(app.getRequest().getChatId(), 'Бот успешно добавлен')
}
