import DB from '~apps/shared/infrastructure/database'
import { get as RedisGet } from '~apps/shared/infrastructure/redis'
import { getUserStateKey } from '~apps/shared/infrastructure/redis-key'
import UserState from '~apps/shared/interfaces/user-state'

export const getState = async (
  userId: number
): Promise<UserState | undefined> => {
  const stateFromRedis = await RedisGet(getUserStateKey(userId))
  if (stateFromRedis) {
    return {
      user_id: userId,
      data: JSON.parse(stateFromRedis),
    }
  }

  return DB<UserState>('user_states as us')
    .select('us.*')
    .where('us.user_id', userId)
    .first()
}
