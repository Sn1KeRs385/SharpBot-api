import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { addChannel } from '~apps/telegram-bot/services/channel-service'

const getId = (app: AppContainer, key: string): number => {
  const id = app.getRequest().getParam(key)

  if (!id || !parseInt(id.toString())) {
    throw new Error(`Идентификатор ${key} не найден`)
  }

  return parseInt(id.toString())
}
// const getDisableRedirect = (app: AppContainer): boolean => {
//   const disableRedirect = app.getRequest().getParam('disableRedirect')
//
//   return boolParse(disableRedirect)
// }

export default async (app: AppContainer) => {
  const botId = getId(app, 'botId')
  const chatId = getId(app, 'chatId')
  // const disableRedirect = getDisableRedirect(app)

  const result = await addChannel(app.getUser().id, botId, chatId)
  const botInfo = await result.tgBot.getChat(chatId)

  await app
    .getBot()
    .sendMessage(
      app.getRequest().getChatId(),
      `Канал ${botInfo.title} успешно добавлен. @${result.botEntity.username} будет использован для управления сообщениями`
    )
}
