import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'

const getMessageId = (app: AppContainer): number | undefined => {
  const messageId = app.getRequest().getParam('messageId')

  if (!messageId || !parseInt(messageId.toString())) {
    return undefined
  }

  return parseInt(messageId.toString())
}
export default async (app: AppContainer) => {
  const messageId =
    getMessageId(app) || app.getRequest().getMessage()?.message_id

  if (
    !messageId ||
    app.getRequest().getCallbackQuery()?.message?.message_id === messageId
  ) {
    return null
  }

  await app
    .getBot()
    .deleteMessage(app.getRequest().getChatId(), messageId.toString())
}
