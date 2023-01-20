export default class RouteNotFoundByPathError extends Error {
  constructor(routePath: string) {
    super(`Route "${routePath}" not found`)

    Object.setPrototypeOf(this, RouteNotFoundByPathError.prototype)
  }
}
