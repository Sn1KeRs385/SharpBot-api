export default class RoutePathDuplicationError extends Error {
  constructor(routePath: string) {
    super(`Route with path "${routePath}" already exists`)

    Object.setPrototypeOf(this, RoutePathDuplicationError.prototype)
  }
}
