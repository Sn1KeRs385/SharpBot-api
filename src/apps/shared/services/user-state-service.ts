import DB from '~apps/shared/infrastructure/database'
import { set as RedisSet } from '~apps/shared/infrastructure/redis'
import { getUserStateKey } from '~apps/shared/infrastructure/redis-key'
import UserState from '~apps/shared/interfaces/user-state'
import State from '~apps/telegram-bot/infrastructure/state'

export const saveState = async (userId: number, state: State) => {
  await RedisSet(getUserStateKey(userId), JSON.stringify(state))

  const stateExists = await DB<UserState>('user_states as us')
    .select('us.user_id')
    .where('us.user_id', userId)
    .first()

  if (stateExists) {
    await DB<UserState>('user_states as us')
      .where('us.user_id', userId)
      .update({ data: state })
  } else {
    await DB<UserState>('user_states as us')
      .where('us.user_id', userId)
      .insert({
        user_id: userId,
        data: state,
      })
  }
}
