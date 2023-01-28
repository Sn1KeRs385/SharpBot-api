import TelegramBot, { Message } from 'node-telegram-bot-api'
import {
  handleCallbackQuery,
  handleText,
} from '~apps/telegram-bot/infrastructure/action-handler'
import { initRoutes } from '~apps/telegram-bot/routes'
import { getMe } from '~apps/telegram-bot/utils/tg-bot'
import * as crypto from 'crypto'

export const startMainBot = () => {
  const botApiKey = process.env.TELEGRAM_BOT_API_KEY
  if (!botApiKey) {
    throw Error('Bot api key is not set')
  }

  initRoutes()

  const bot = new TelegramBot(botApiKey, { polling: true })
  const botApiKeyHash = crypto.createHash('md5').update(botApiKey).digest('hex')

  bot.onText(/.*/, async (message: Message) => {
    await handleText(bot, botApiKeyHash, message)
  })

  bot.on('callback_query', async (callbackQuery) => {
    await handleCallbackQuery(bot, botApiKeyHash, callbackQuery)
  })

  console.log('Telegram bot started')
}
