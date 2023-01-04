import * as crypto from 'crypto'
import TelegramBot, { Message } from 'node-telegram-bot-api'
import User from '~apps/shared/interfaces/user'
import UserNotSetError from '~apps/telegram-bot/errors/user-not-set-error'
import MessageNotSetError from '~apps/telegram-bot/errors/message-not-set-error'
import ActionNotSetError from '~apps/telegram-bot/errors/action-not-set-error'

export default class AppContainer {
  protected appKey: string
  protected bot: TelegramBot

  protected message?: Message
  protected user?: User
  protected action?: string

  constructor(bot: TelegramBot) {
    this.appKey = crypto.randomUUID()
    this.bot = bot
  }

  public getAppKey(): string {
    return this.appKey
  }

  public getBot(): TelegramBot {
    return this.bot
  }

  public setMessage(message: Message): AppContainer {
    this.message = message
    return this
  }

  public getMessage(): Message {
    if (!this.message) {
      throw MessageNotSetError
    }

    return this.message
  }

  public setUser(user: User): AppContainer {
    this.user = user
    return this
  }

  public getUser(): User {
    if (!this.user) {
      throw UserNotSetError
    }

    return this.user
  }

  public setAction(action: string): AppContainer {
    this.action = action
    return this
  }

  public getAction(): string | undefined {
    return this.action
  }

  public getActionOrError(): string {
    if (!this.action) {
      throw ActionNotSetError
    }
    return this.action
  }
}
