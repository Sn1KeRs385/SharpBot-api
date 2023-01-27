import BaseError from '~apps/shared/errors/base-error'

export default class TgBotNotFoundError extends BaseError {
  constructor() {
    super(`Tg bot not found with`)

    Object.setPrototypeOf(this, TgBotNotFoundError.prototype)
  }
}
