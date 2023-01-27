import AppContainer from '~apps/telegram-bot/infrastructure/app-container'

export default abstract class BaseTelegramBotError extends Error {
  protected constructor(message?: string) {
    super(message)

    Object.setPrototypeOf(this, BaseTelegramBotError.prototype)
  }

  protected getUserMessage() {
    return 'Произошла ошибка, попробуйте повторить позже'
  }

  public async sendMessageToUser(app: AppContainer) {
    await app
      .getBot()
      .sendMessage(app.getRequest().getChatId(), this.getUserMessage())
  }
}
