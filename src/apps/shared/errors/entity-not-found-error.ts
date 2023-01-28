import BaseError from '~apps/shared/errors/base-error'

export default class EntityNotFoundError extends BaseError {
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(entity: string, params: any) {
    super(`Entity: ${entity} not found with params: ${JSON.stringify(params)}`)

    Object.setPrototypeOf(this, EntityNotFoundError.prototype)
  }
}
