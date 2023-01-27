import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'

export default async (app: AppContainer) => {
  const nextRoute = getRouteByName('BotsAddByApiKey')
  app.getState().setNextRoutePath(nextRoute.path)

  await app
    .getBot()
    .sendMessage(
      app.getRequest().getChatId(),
      'Введите ключ от бота в следующем сообщении'
    )
}
