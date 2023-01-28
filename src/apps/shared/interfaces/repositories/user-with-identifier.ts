import UserIdentifierType from '~apps/shared/enums/user-identifier-type'
import User from '~apps/shared/interfaces/entities/user'

export default interface UserWithIdentifier extends User {
  identifier_type: UserIdentifierType
  identifier_value: string
}
