export default class RouteNotFoundByNameError extends Error {
  constructor(routeName: string) {
    super(`Route with name "${routeName}" not found`)

    Object.setPrototypeOf(this, RouteNotFoundByNameError.prototype)
  }
}
