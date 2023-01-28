import {
  get as RedisGet,
  set as RedisSet,
} from '~apps/shared/infrastructure/redis'
import { getUserStateKey } from '~apps/shared/infrastructure/redis-key'
import State from '~apps/telegram-bot/infrastructure/state'
import UserState from '~apps/shared/interfaces/entities/user-state'
import UserStateRepository from '~apps/shared/repositories/user-state-repository'

export const saveState = async (userId: number, state: State) => {
  await RedisSet(getUserStateKey(userId), JSON.stringify(state))

  await UserStateRepository.updateOrCreate({ user_id: userId }, { data: state })
}

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

  return UserStateRepository.first({ user_id: userId })
}
