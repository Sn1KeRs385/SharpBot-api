import WithTimestamps from '~apps/shared/interfaces/entities/helpers/with-timestamps'
import SoftDelete from '~apps/shared/interfaces/entities/helpers/soft-delete'

export default interface Channel extends WithTimestamps, SoftDelete {
  id: number
  user_id: number
  title: string
  type: string
  identifier: string
  bot_id: number
}
