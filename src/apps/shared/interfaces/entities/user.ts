import WithTimestamps from '~apps/shared/interfaces/entities/helpers/with-timestamps'
import SoftDelete from '~apps/shared/interfaces/entities/helpers/soft-delete'

export default interface User extends WithTimestamps, SoftDelete {
  id: number
}
