import BaseRepository from '~apps/shared/repositories/base-repository'
import TgBot from '~apps/shared/interfaces/entities/tg-bot'

class TgBotRepository extends BaseRepository<TgBot> {
  protected readonly table = 'tg_bots'
}

const instance = new TgBotRepository()
export default instance
