import TgBotRepository from '~apps/shared/repositories/tg-bot-repository'
import TelegramBot from 'node-telegram-bot-api'
import ChannelRepository from '~apps/shared/repositories/channel-repository'
import ChannelType from '~apps/shared/enums/channel-type'
import BotHasNotPermissionError from '~apps/telegram-bot/errors/bot-has-not-permission-error'
import TgBot from '~apps/shared/interfaces/entities/tg-bot'
import ChannelPermission, {
  CHANNEL_EDITOR_PERMISSION,
} from '~apps/shared/enums/channel-permission'

export const addChannel = async (
  userId: number,
  botId: number,
  chatId: number
): Promise<{ tgBot: TelegramBot; botEntity: TgBot }> => {
  const bot = await TgBotRepository.firstOrFail({
    id: botId,
    user_id: userId,
  })

  const tgBot = new TelegramBot(bot.api_key)
  const tgBotInfo = await tgBot.getMe()
  const chatMemberInfo = await tgBot.getChatMember(
    chatId,
    tgBotInfo.id.toString()
  )

  if (!checkPermissions(chatMemberInfo, CHANNEL_EDITOR_PERMISSION)) {
    throw new BotHasNotPermissionError()
  }

  const chatInfo = await tgBot.getChat(chatId)

  await ChannelRepository.create({
    user_id: userId,
    type: ChannelType.TG_CHAT,
    identifier: chatId.toString(),
    bot_id: bot.id,
    title: chatInfo.title,
  })

  return {
    tgBot,
    botEntity: bot,
  }
}

export const checkPermissions = (
  chatMember: TelegramBot.ChatMember,
  permissions: ChannelPermission[]
) => {
  let botHasPermissions = true
  permissions.forEach((permission) => {
    if (!botHasPermissions) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!chatMember[permission]) {
      botHasPermissions = false
    }
  })

  return botHasPermissions
}
