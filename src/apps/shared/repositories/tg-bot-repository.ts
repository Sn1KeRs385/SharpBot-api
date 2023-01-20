import DB from '~apps/shared/infrastructure/database'
import FindParams from '~apps/shared/interfaces/repositories/tg-bot/find-params'
import TgBot from '~apps/shared/interfaces/tg-bot'

export const find = (params: FindParams) => {
  const query = DB<TgBot>('tg_bots')
  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return
    }
    query.where(key, value)
  })
  return query.first()
}
