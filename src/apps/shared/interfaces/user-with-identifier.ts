import User from '~apps/shared/interfaces/user'
import UserIdentifier from '~apps/shared/enums/user-identifier'

export default interface UserWithIdentifier extends User {
  identifier_type: UserIdentifier
  identifier_value: string
}
