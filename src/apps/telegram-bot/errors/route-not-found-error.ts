import BaseTelegramBotError from '~apps/telegram-bot/errors/base-telegram-bot-error'

export default class RouteNotFoundError extends BaseTelegramBotError {
  constructor() {
    super('Route not found')

    Object.setPrototypeOf(this, RouteNotFoundError.prototype)
  }

  protected getUserMessage() {
    return 'Не удалось определить команду'
  }
}
