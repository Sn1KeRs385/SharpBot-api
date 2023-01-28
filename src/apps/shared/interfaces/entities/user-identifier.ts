import WithTimestamps from '~apps/shared/interfaces/entities/helpers/with-timestamps'
import SoftDelete from '~apps/shared/interfaces/entities/helpers/soft-delete'

export default interface UserIdentifier extends WithTimestamps, SoftDelete {
  id: number
  user_id: number
  type: string
  value: string
}
