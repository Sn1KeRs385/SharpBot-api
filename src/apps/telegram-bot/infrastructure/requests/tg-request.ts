import ApiData from '~apps/shared/interfaces/api-data'
import { CallbackQuery, Message } from 'node-telegram-bot-api'
import { tryGetRouteByName, tryGetRouteByPath } from '~apps/telegram-bot/routes'
import Route from '~apps/telegram-bot/interfaces/route'
import MessageNotSetError from '~apps/telegram-bot/errors/message-not-set-error'

export default class TgRequest {
  protected params: ApiData = {}
  protected chatId: number
  protected route?: Route
  protected message?: Message
  protected callbackQuery?: CallbackQuery

  constructor(chatId: number) {
    this.chatId = chatId
  }
  public getChatId(): number {
    return this.chatId
  }
  public getMessage(): Message | undefined {
    return this.message
  }
  public getMessageOrError(): Message {
    if (!this.message) {
      throw MessageNotSetError
    }
    return this.message
  }
  public getRoute(): Route | undefined {
    return this.route
  }
  public getParams(): ApiData {
    return this.params
  }
  public getParam(key: string) {
    return this.params[key]
  }
  public hasParam(key: string) {
    return !!this.params[key]
  }

  public setMessage(message: Message): TgRequest {
    this.message = message

    if (message.text) {
      this.parseRouteAndParams(message.text)
    }

    return this
  }

  public setCallbackQuery(callbackQuery: CallbackQuery): TgRequest {
    this.callbackQuery = callbackQuery

    if (callbackQuery.data) {
      this.parseRouteAndParams(callbackQuery.data)
    }

    if (callbackQuery.message) {
      this.setMessage(callbackQuery.message)
    }

    return this
  }

  protected parseRouteAndParams(text: string) {
    const splitText = text.split(' ')

    if (splitText.length === 0) {
      return
    }

    if (this.message?.forward_from?.username === 'BotFather') {
      this.route = tryGetRouteByName('ForwardFromBotFatherAction')
    }

    if (!this.route && splitText[0].search(/\/.*/) === 0) {
      this.route = tryGetRouteByPath(splitText[0])
    }

    splitText.forEach((textTemp) => {
      if (/^-[A-z0-9]+=/.test(textTemp)) {
        const values = textTemp.split('=')
        this.params[values[0].substring(1)] = values[1]
      }
    })
  }
}
