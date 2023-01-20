export default class RouteNameDuplicationError extends Error {
  constructor(routeName: string) {
    super(`Route with name "${routeName}" already exists`)

    Object.setPrototypeOf(this, RouteNameDuplicationError.prototype)
  }
}
