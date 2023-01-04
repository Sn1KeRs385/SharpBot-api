export default class ActionNotSetError extends Error {
  constructor() {
    super('Action not set')
  }
}
