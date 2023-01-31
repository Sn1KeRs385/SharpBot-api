import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import TelegramBot from 'node-telegram-bot-api'
import TgBotRepository from '~apps/shared/repositories/tg-bot-repository'
import TgBot from '~apps/shared/interfaces/entities/tg-bot'
import ChannelRepository from '~apps/shared/repositories/channel-repository'
import ChannelType from '~apps/shared/enums/channel-type'
import { getRouteByName } from '~apps/telegram-bot/routes'
import { checkPermissions } from '~apps/telegram-bot/services/channel-service'
import { CHANNEL_EDITOR_PERMISSION } from '~apps/shared/enums/channel-permission'

const getChatId = (app: AppContainer): number => {
  const chatId = app.getRequest().getMessage()?.forward_from_chat?.id

  if (!chatId) {
    throw new Error('Идентификатор чата не найден')
  }

  return chatId
}

export default async (app: AppContainer) => {
  const chatName = app.getRequest().getMessage()?.forward_from_chat?.title || ''
  const chatId = getChatId(app)

  const channel = await ChannelRepository.first({
    user_id: app.getUser().id,
    type: ChannelType.TG_CHAT,
    identifier: chatId.toString(),
  })

  if (channel) {
    await app
      .getBot()
      .sendMessage(
        app.getRequest().getChatId(),
        `Канал ${chatName} уже добавлен`
      )
    return
  }

  const bots = await TgBotRepository.getList({ user_id: app.getUser().id })

  const botsFind: TgBot[] = []

  for (let i = 0; i < bots.length; i++) {
    try {
      const tgBot = new TelegramBot(bots[i].api_key)
      const botInfo = await tgBot.getMe()
      const chatMemberInfo = await tgBot.getChatMember(
        chatId,
        botInfo.id.toString()
      )
      if (checkPermissions(chatMemberInfo, CHANNEL_EDITOR_PERMISSION)) {
        botsFind.push(bots[i])
      }
    } catch (er) {
      /* empty */
    }
  }

  if (botsFind.length === 0) {
    await app
      .getBot()
      .sendMessage(
        app.getRequest().getChatId(),
        `Ни один ваш бот не может управлять сообщениями чате ${chatName}. Сначала нужно добавить бота в группу администраторов, потом пересылать сообщения`
      )
    return
  } else if (botsFind.length === 1) {
    await ChannelRepository.create({
      user_id: app.getUser().id,
      type: ChannelType.TG_CHAT,
      identifier: chatId.toString(),
      bot_id: botsFind[0].id,
    })
    await app
      .getBot()
      .sendMessage(
        app.getRequest().getChatId(),
        `Канал ${chatName} успешно добавлен. @${botsFind[0].username} будет использован для управления сообщениями`
      )
  } else {
    const buttons = botsFind.map((bot) => {
      return [
        {
          text: `${bot.name} (@${bot.username})`,
          callback_data:
            getRouteByName('ChannelsAddChannelByIds').path +
            ` -botId=${bot.id} -chatId=${chatId}`,
        },
      ]
    })

    await app
      .getBot()
      .sendMessage(
        app.getRequest().getChatId(),
        `К каналу ${chatName} имеет доступ несколько ваших ботов. Выберите того, который должен быть использован для отправки сообщений.`,
        {
          reply_markup: {
            inline_keyboard: [
              ...buttons,
              [
                {
                  text: 'Закрыть',
                  callback_data:
                    getRouteByName('MessagesDeleteFromSelfChat').path +
                    ` -noError=true`,
                },
              ],
            ],
          },
        }
      )
  }
}
