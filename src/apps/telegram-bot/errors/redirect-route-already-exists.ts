import BaseTelegramBotError from '~apps/telegram-bot/errors/base-telegram-bot-error'

export default class RedirectRouteAlreadyExists extends BaseTelegramBotError {
  constructor() {
    super('Redirect route already exists')

    Object.setPrototypeOf(this, RedirectRouteAlreadyExists.prototype)
  }
}
