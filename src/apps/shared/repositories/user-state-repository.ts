import BaseRepository from '~apps/shared/repositories/base-repository'
import UserState from '~apps/shared/interfaces/entities/user-state'

class UserStateRepository extends BaseRepository<UserState> {
  protected readonly table = 'user_states'

  protected readonly primaryKey = 'user_id'

  protected readonly useTimestamp: boolean = false
  protected readonly softDelete: boolean = false
}

const instance = new UserStateRepository()
export default instance
