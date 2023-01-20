import BaseTelegramBotError from '~apps/telegram-bot/errors/base-telegram-bot-error'

export default class IncorrectBotApiKeyError extends BaseTelegramBotError {
  constructor() {
    super('Incorrect bot api key')

    Object.setPrototypeOf(this, IncorrectBotApiKeyError.prototype)
  }

  protected getUserMessage(): string {
    return 'Ошибка. Введен некорректный ключ от бота'
  }
}
