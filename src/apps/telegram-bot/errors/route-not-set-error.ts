export default class RouteNotSetError extends Error {
  constructor() {
    super('Route not set')

    Object.setPrototypeOf(this, RouteNotSetError.prototype)
  }
}
