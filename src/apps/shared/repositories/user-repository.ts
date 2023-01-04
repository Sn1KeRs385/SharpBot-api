import UserIdentifier from '~apps/shared/enums/user-identifier'
import DB from '~apps/shared/utils/database'
import User from '~apps/shared/interfaces/user'
import UserIdentifierSearch from '~apps/shared/interfaces/user-identifier-search'
import UserWithIdentifier from '~apps/shared/interfaces/user-with-identifier'

export const findByIdentifier = async (type: UserIdentifier, value: string) => {
  return DB<User>('user_identifiers as ui')
    .leftJoin('users as u', function () {
      this.on('ui.user_id', '=', 'u.id')
    })
    .select('u.*')
    .where('ui.type', type)
    .where('ui.value', value)
    .first()
}

export const findByIdentifiers = async (
  userIdentifiers: UserIdentifierSearch[]
): Promise<UserWithIdentifier[]> => {
  const query = DB<UserWithIdentifier>('user_identifiers as ui')
    .leftJoin('users as u', function () {
      this.on('ui.user_id', '=', 'u.id')
    })
    .select('u.*', 'ui.type as identifier_type', 'ui.value as identifier_value')

  userIdentifiers.forEach((userIdentifier) => {
    query.orWhere((builder) => {
      builder.where('ui.type', userIdentifier.type)
      builder.where('ui.value', userIdentifier.value)
    })
  })

  return query
}
