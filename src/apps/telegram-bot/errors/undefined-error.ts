import BaseTelegramBotError from '~apps/telegram-bot/errors/base-telegram-bot-error'

export default class UndefinedError extends BaseTelegramBotError {
  constructor() {
    super('Undefined')

    Object.setPrototypeOf(this, UndefinedError.prototype)
  }

  protected getUserMessage() {
    return 'Произошла неизвестная ошибка, попробуйте повторить позже'
  }
}
