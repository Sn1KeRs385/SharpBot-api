import DB from '~apps/shared/infrastructure/database'
import FindParams from '~apps/shared/interfaces/repositories/tg-bot/find-params'
import TgBot from '~apps/shared/interfaces/tg-bot'
import TgBotNotFoundError from '~apps/shared/errors/tg-bot-not-found-error'

export const find = (params: FindParams) => {
  const query = DB<TgBot>('tg_bots').whereNull('deleted_at')
  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return
    }
    query.where(key, value)
  })
  return query.first()
}
export const findOrFail = async (params: FindParams): Promise<TgBot> => {
  const bot = await find(params)
  if (!bot) {
    throw new TgBotNotFoundError()
  }
  return bot
}

export const listForUser = (userId: number) => {
  return DB<TgBot>('tg_bots').where('user_id', userId).whereNull('deleted_at')
}
