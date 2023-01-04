export default class RouterNotFoundError extends Error {
  constructor() {
    super('Router not found')
  }
}
