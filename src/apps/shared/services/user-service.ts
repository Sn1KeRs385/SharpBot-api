import UserIdentifier from '~apps/shared/enums/user-identifier'
import DB from '~apps/shared/utils/database'
import * as UserRepository from '~apps/shared/repositories/user-repository'
import User from '~apps/shared/interfaces/user'
import UserIdentifierSearch from '~apps/shared/interfaces/user-identifier-search'

export const firstOrCreate = async (type: UserIdentifier, value: string) => {
  let user = await UserRepository.findByIdentifier(type, value)

  if (!user) {
    user = await DB<User>('users').insert({}, ['*'])
    await DB('user_identifiers').insert({
      user_id: user[0].id,
      type,
      value,
    })
  }

  return user
}

export const searchAndSyncByIdentifiers = async (
  userIdentifiers: UserIdentifierSearch[]
): Promise<User> => {
  const users = await UserRepository.findByIdentifiers(userIdentifiers)

  let user: User
  if (users.length > 0) {
    user = users[0]
  } else {
    user = (await DB<User>('users').insert({}, ['*']))[0]
  }

  await Promise.all(
    userIdentifiers
      .filter((userIdentifier) => {
        return !users.find(
          (userFind) =>
            userFind.identifier_type === userIdentifier.type &&
            userFind.identifier_value === userIdentifier.value
        )
      })
      .map(async (userIdentifier) => {
        await DB('user_identifiers').insert({
          user_id: user.id,
          type: userIdentifier.type,
          value: userIdentifier.value,
        })
      })
  )

  return user
}
