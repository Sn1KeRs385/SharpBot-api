import TelegramBot, { Message } from 'node-telegram-bot-api'
import {
  handleCallbackQuery,
  handleText,
} from '~apps/telegram-bot/infrastructure/action-handler'

export const startMainBot = () => {
  const botApiKey = process.env.TELEGRAM_BOT_API_KEY
  if (!botApiKey) {
    throw Error('Bot api key is not set')
  }

  const bot = new TelegramBot(botApiKey, { polling: true })
  bot.onText(/.*/, async (message: Message) => {
    await handleText(bot, message)
  })

  bot.on('callback_query', async (callbackQuery) => {
    await handleCallbackQuery(bot, callbackQuery)
  })

  console.log('Telegram bot started')
}
