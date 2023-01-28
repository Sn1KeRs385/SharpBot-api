import WithTimestamps from '~apps/shared/interfaces/entities/helpers/with-timestamps'
import SoftDelete from '~apps/shared/interfaces/entities/helpers/soft-delete'

export default interface TgBot extends WithTimestamps, SoftDelete {
  id: number
  user_id: number
  api_key: string
  username: string
  name: string
}
