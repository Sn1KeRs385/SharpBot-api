import DB from '~apps/shared/infrastructure/database'
import UpdateOrCreateParams from '~apps/shared/interfaces/services/tg-bot/update-or-create-params'
import * as TgBotRepository from '~apps/shared/repositories/tg-bot-repository'
import TgBot from '~apps/shared/interfaces/tg-bot'
import { timestampsOnUpdate } from '~apps/shared/infrastructure/entity-properties'

export const updateOrCreate = async (params: UpdateOrCreateParams) => {
  let tgBot = await TgBotRepository.find({
    user_id: params.user_id,
    api_key: params.api_key,
  })

  if (!tgBot) {
    tgBot = await DB<TgBot>('tg_bots').insert(params, ['*'])
  } else {
    if (tgBot.name !== params.name || tgBot.username !== params.username) {
      await DB<TgBot>('tg_bots')
        .where('id', tgBot.id)
        .update(
          {
            ...params,
            ...timestampsOnUpdate(),
          },
          ['*']
        )
      tgBot.name = params.name
      tgBot.username = params.username
    }
  }

  return tgBot
}
