import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'

export default async (app: AppContainer) => {
  const nexRoute = getRouteByName('BotsAddByApiKey')
  app.getState().setNextRoutePath(nexRoute.path)

  await app
    .getBot()
    .sendMessage(
      app.getMessage().chat.id,
      'Введите ключ от бота в следующем сообщении'
    )
}
