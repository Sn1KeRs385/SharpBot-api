import UserIdentifierType from '~apps/shared/enums/user-identifier-type'
import DB from '~apps/shared/infrastructure/database'
import BaseRepository from '~apps/shared/repositories/base-repository'
import User from '~apps/shared/interfaces/entities/user'
import UserWithIdentifier from '~apps/shared/interfaces/repositories/user-with-identifier'
import UserIdentifierSearch from '~apps/shared/interfaces/repositories/user-identifier-search'

class UserRepository extends BaseRepository<User> {
  protected readonly table = 'users'

  public findByIdentifier(type: UserIdentifierType, value: string) {
    return DB<User>('user_identifiers as ui')
      .leftJoin('users as u', function () {
        this.on('ui.user_id', '=', 'u.id')
      })
      .select('u.*')
      .where('ui.type', type)
      .where('ui.value', value)
      .whereNull('u.deleted_at')
      .whereNull('ui.deleted_at')
      .first()
  }

  public findByIdentifiers(userIdentifiers: UserIdentifierSearch[]) {
    const query = DB<UserWithIdentifier>('user_identifiers as ui')
      .leftJoin('users as u', function () {
        this.on('ui.user_id', '=', 'u.id')
      })
      .select(
        'u.*',
        'ui.type as identifier_type',
        'ui.value as identifier_value'
      )
      .whereNull('u.deleted_at')
      .whereNull('ui.deleted_at')
      .where((builder) => {
        userIdentifiers.forEach((userIdentifier, index) => {
          builder[index === 0 ? 'where' : 'orWhere']((builder) => {
            builder
              .where('ui.type', userIdentifier.type)
              .where('ui.value', userIdentifier.value)
          })
        })
      })

    return query
  }
}

const instance = new UserRepository()
export default instance
