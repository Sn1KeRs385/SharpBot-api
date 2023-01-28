import UserIdentifierType from '~apps/shared/enums/user-identifier-type'
import DB from '~apps/shared/infrastructure/database'
import User from '~apps/shared/interfaces/entities/user'
import UserIdentifierEntity from '~apps/shared/interfaces/entities/user-identifier'
import UserRepository from '~apps/shared/repositories/user-repository'
import UserIdentifierSearch from '~apps/shared/interfaces/repositories/user-identifier-search'
import UserIdentifierRepository from '~apps/shared/repositories/user-identifier-repository'

export const firstOrCreateByIdentifier = async (
  type: UserIdentifierType,
  value: string
) => {
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
    user = users[0] as User
  } else {
    user = await UserRepository.create({})
  }

  const paramsArray = userIdentifiers
    .filter((userIdentifier) => {
      return !users.find(
        (userFind) =>
          userFind.identifier_type === userIdentifier.type &&
          userFind.identifier_value === userIdentifier.value
      )
    })
    .map(
      (userIdentifier) =>
        ({
          user_id: user.id,
          type: userIdentifier.type,
          value: userIdentifier.value,
        } as Partial<UserIdentifierEntity>)
    )
  await UserIdentifierRepository.createMany(paramsArray)

  // await Promise.all(
  //   userIdentifiers
  //     .filter((userIdentifier) => {
  //       return !users.find(
  //         (userFind) =>
  //           userFind.identifier_type === userIdentifier.type &&
  //           userFind.identifier_value === userIdentifier.value
  //       )
  //     })
  //     .map(async (userIdentifier) => {
  //       await UserIdentifierRepository.create({
  //         user_id: user.id,
  //         type: userIdentifier.type,
  //         value: userIdentifier.value,
  //       })
  //     })
  // )

  return user
}
