export default class MessageNotFoundError extends Error {
  constructor() {
    super('Message not found')

    Object.setPrototypeOf(this, MessageNotFoundError.prototype)
  }
}
