import UserIdentifierType from '~apps/shared/enums/user-identifier-type'

export default interface UserIdentifierSearch {
  type: UserIdentifierType
  value: string
}
