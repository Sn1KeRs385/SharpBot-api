import AppContainer from '~apps/telegram-bot/infrastructure/app-container'

export default class BaseTelegramBotError extends Error {
  constructor(message?: string) {
    super(message)

    Object.setPrototypeOf(this, BaseTelegramBotError.prototype)
  }

  protected getUserMessage() {
    return 'Произошла ошибка, попробуйте повторить позже'
  }

  public async sendMessageToUser(app: AppContainer) {
    await app
      .getBot()
      .sendMessage(app.getMessage().chat.id, this.getUserMessage())
  }
}
