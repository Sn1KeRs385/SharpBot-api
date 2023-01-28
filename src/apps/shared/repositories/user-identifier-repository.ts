import BaseRepository from '~apps/shared/repositories/base-repository'
import UserIdentifier from '~apps/shared/interfaces/entities/user-identifier'

class UserIdentifierRepository extends BaseRepository<UserIdentifier> {
  protected readonly table = 'user_identifiers'
}

const instance = new UserIdentifierRepository()
export default instance
