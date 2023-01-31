import BaseTelegramBotError from '~apps/telegram-bot/errors/base-telegram-bot-error'

export default class BotHasNotPermissionError extends BaseTelegramBotError {
  constructor() {
    super('Bot has not permission')

    Object.setPrototypeOf(this, BotHasNotPermissionError.prototype)
  }

  protected getUserMessage() {
    return 'Не достаточно прав'
  }
}
