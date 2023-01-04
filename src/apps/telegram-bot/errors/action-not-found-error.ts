export default class ActionNotFoundError extends Error {
  constructor() {
    super('Action not found')
  }
}
