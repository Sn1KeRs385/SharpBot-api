export default class UserNotSetError extends Error {
  constructor() {
    super('User not set')

    Object.setPrototypeOf(this, UserNotSetError.prototype)
  }
}
