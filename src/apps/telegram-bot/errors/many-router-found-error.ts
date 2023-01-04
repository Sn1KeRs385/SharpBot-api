export default class ManyRouterFoundError extends Error {
  constructor() {
    super('Find mort than 2 router')
  }
}
