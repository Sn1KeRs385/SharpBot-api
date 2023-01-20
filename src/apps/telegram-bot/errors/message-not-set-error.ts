export default class MessageNotSetError extends Error {
  constructor() {
    super('Message not set')

    Object.setPrototypeOf(this, MessageNotSetError.prototype)
  }
}
