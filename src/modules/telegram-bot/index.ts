import TelegramBot, { Message } from 'node-telegram-bot-api'

export const startMainBot = () => {
  const botApiKey = process.env.TELEGRAM_BOT_API_KEY
  if (!botApiKey) {
    throw Error('Bot api key is not set')
  }

  const bot = new TelegramBot(botApiKey, { polling: true })

  bot.onText(/\/start/, (msg: Message, match: RegExpExecArray | null) => {
    console.log(msg)
    console.log(match)
    // const chatId = msg.chat.id
    // const resp = match[1]
    //
    // bot.sendMessage(chatId, resp)
  })
  console.log('startMainBot')
}
