export default class RouteNotFoundError extends Error {
  constructor() {
    super('Action not found')

    Object.setPrototypeOf(this, RouteNotFoundError.prototype)
  }
}
