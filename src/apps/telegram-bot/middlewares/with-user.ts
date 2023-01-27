import * as UserService from '~apps/shared/services/user-service'
import UserIdentifier from '~apps/shared/enums/user-identifier'
import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import UserIdentifierSearch from '~apps/shared/interfaces/user-identifier-search'

export default async (app: AppContainer) => {
  const message = app.getRequest().getMessage()

  const identifiers: UserIdentifierSearch[] = []

  if (message?.from?.id) {
    identifiers.push({
      type: UserIdentifier.TG_USER_ID,
      value: message.from.id.toString(),
    })
  }
  if (message?.chat.type === 'private') {
    identifiers.push({
      type: UserIdentifier.TG_CHAT_ID,
      value: message.chat.id.toString(),
    })
  }

  const user = await UserService.searchAndSyncByIdentifiers(identifiers)

  await app.setUser(user)
}
