import TelegramBot from 'node-telegram-bot-api'
import { remember } from '~apps/shared/infrastructure/redis'

export const getMe = async (
  botApiKey: string,
  bot: TelegramBot
): Promise<TelegramBot.User> => {
  return await remember(`tg_bot_info_by_key_${botApiKey}`, 3600, async () => {
    return await bot.getMe()
  })
}
