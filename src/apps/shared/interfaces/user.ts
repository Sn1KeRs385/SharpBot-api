import WithTimestamps from '~apps/shared/interfaces/helpers/with-timestamps'
import SoftDelete from '~apps/shared/interfaces/helpers/soft-delete'

export default interface User extends WithTimestamps, SoftDelete {
  id: number
}
