import * as crypto from 'crypto'
import TelegramBot, { Message } from 'node-telegram-bot-api'
import User from '~apps/shared/interfaces/user'
import UserNotSetError from '~apps/telegram-bot/errors/user-not-set-error'
import MessageNotSetError from '~apps/telegram-bot/errors/message-not-set-error'
import RouteNotSetError from '~apps/telegram-bot/errors/route-not-set-error'
import State from '~apps/telegram-bot/infrastructure/state'
import StateNotSetError from '~apps/telegram-bot/errors/state-not-set-error'
import Route from '~apps/telegram-bot/interfaces/route'
import RedirectRouteAlreadyExists from '~apps/telegram-bot/errors/redirect-route-already-exists'
import AfterActionHook from '~apps/telegram-bot/interfaces/after-action-hook'

export default class AppContainer {
  protected appKey: string
  protected bot: TelegramBot

  protected message?: Message
  protected user?: User
  protected route?: Route
  protected state?: State

  protected redirectRoute?: Route

  protected afterActionHooks: AfterActionHook[]

  constructor(bot: TelegramBot) {
    this.appKey = crypto.randomUUID()
    this.bot = bot
    this.afterActionHooks = []
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

  public setRoute(route: Route): AppContainer {
    this.route = route
    return this
  }

  public getRoute(): Route | undefined {
    return this.route
  }

  public getRouteOrError(): Route {
    if (!this.route) {
      throw RouteNotSetError
    }
    return this.route
  }

  public setState(state: State): AppContainer {
    this.state = state
    return this
  }

  public getState(): State {
    if (!this.state) {
      throw StateNotSetError
    }
    return this.state
  }

  public addAfterActionHook(fn: AfterActionHook): AppContainer {
    this.afterActionHooks.push(fn)
    return this
  }

  public getAfterActionHooks(): AfterActionHook[] {
    return this.afterActionHooks
  }

  public setRedirectRoute(route: Route): AppContainer {
    if (this.redirectRoute) {
      throw RedirectRouteAlreadyExists
    }

    this.redirectRoute = route
    return this
  }

  public getRedirectRoute(): Route | undefined {
    return this.redirectRoute
  }
}
