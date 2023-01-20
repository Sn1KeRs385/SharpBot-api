import BaseTelegramBotError from '~apps/telegram-bot/errors/base-telegram-bot-error'

export default class StateNotSetError extends BaseTelegramBotError {
  constructor() {
    super('State not set')

    Object.setPrototypeOf(this, StateNotSetError.prototype)
  }
}
