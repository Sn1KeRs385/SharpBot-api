import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import TgBotRepository from '~apps/shared/repositories/tg-bot-repository'
import TelegramBot from 'node-telegram-bot-api'
import axios from 'axios'
import TgBot from '~apps/shared/interfaces/entities/tg-bot'
import ChannelRepository from '~apps/shared/repositories/channel-repository'
import ChannelType from '~apps/shared/enums/channel-type'
import { getRouteByName } from '~apps/telegram-bot/routes'
import { checkPermissions } from '~apps/telegram-bot/services/channel-service'
import { CHANNEL_EDITOR_PERMISSION } from '~apps/shared/enums/channel-permission'

const getInviteLink = (app: AppContainer): string | undefined => {
  return app.getRequest().getParam('link')
}

const findBotsParse = async (
  app: AppContainer,
  botsFind: TgBot[],
  chatName: string,
  chatId: number
) => {
  if (botsFind.length === 1) {
    await ChannelRepository.create({
      user_id: app.getUser().id,
      type: ChannelType.TG_CHAT,
      identifier: chatId.toString(),
      bot_id: botsFind[0].id,
      title: chatName,
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

const tryFindChatByUsername = async (app: AppContainer, html: string) => {
  let username = html.match(/domain=[^"]+/gm)?.[0]

  if (!username) {
    return false
  }

  username = '@' + username.replace('domain=', '')
  const bots = await TgBotRepository.getList({ user_id: app.getUser().id })
  const botsFind: TgBot[] = []
  let chatId: number | undefined
  let chatName: string | undefined

  for (let botIndex = 0; botIndex < bots.length; botIndex++) {
    let tgBot: TelegramBot | undefined
    let chatMember: TelegramBot.ChatMember | undefined
    try {
      tgBot = new TelegramBot(bots[botIndex].api_key)
      const me = await tgBot.getMe()
      chatMember = await tgBot.getChatMember(username, me.id.toString())
    } catch (er) {
      continue
    }

    if (
      !chatMember ||
      !checkPermissions(chatMember, CHANNEL_EDITOR_PERMISSION)
    ) {
      continue
    }
    if (!chatId) {
      const chatInfo = await tgBot.getChat(username)
      chatId = chatInfo.id
      chatName = chatInfo.title
    }
    botsFind.push(bots[botIndex])
  }

  if (!chatId || botsFind.length === 0) {
    return false
  }

  await findBotsParse(app, botsFind, chatName || '', chatId)

  return true
}

const tryFindChatByTitle = async (app: AppContainer, html: string) => {
  let chatName = html.match(
    /<meta property="o?g?:?title" content="[^"]+">/gm
  )?.[0]

  if (!chatName) {
    return false
  }

  chatName = chatName
    .match(/content="[^"]+"/gm)?.[0]
    .replace('content="', '')
    .replace('"', '')

  const bots = await TgBotRepository.getList({ user_id: app.getUser().id })
  const botsFind: TgBot[] = []
  let chatId: number | undefined

  for (let botIndex = 0; botIndex < bots.length; botIndex++) {
    let updates: TelegramBot.Update[] = []
    try {
      const tgBot = new TelegramBot(bots[botIndex].api_key)
      updates = await tgBot.getUpdates()
    } catch (er) {
      continue
    }

    for (let i = 0; i < updates.length; i++) {
      if (updates[i].my_chat_member?.chat.title !== chatName) {
        continue
      }
      const chatMember =
        updates[i].my_chat_member?.new_chat_member ||
        updates[i].my_chat_member?.old_chat_member
      if (!chatMember) {
        continue
      }
      if (!checkPermissions(chatMember, CHANNEL_EDITOR_PERMISSION)) {
        continue
      }
      chatId = updates[i].my_chat_member?.chat.id
      botsFind.push(bots[botIndex])
    }
  }

  if (!chatId || botsFind.length === 0) {
    return false
  }

  await findBotsParse(app, botsFind, chatName || '', chatId)

  return true
}

export default async (app: AppContainer) => {
  const inviteLink = getInviteLink(app)

  if (!inviteLink) {
    await app
      .getBot()
      .sendMessage(
        app.getRequest().getChatId(),
        'Не удалось найти канал по ссылке'
      )
    return
  }

  const data = await axios.get(inviteLink)

  let result = await tryFindChatByUsername(app, data.data)

  if (!result) {
    result = await tryFindChatByTitle(app, data.data)
  }

  if (!result) {
    await app
      .getBot()
      .sendMessage(
        app.getRequest().getChatId(),
        'Не удалось найти канал по ссылке'
      )
    return
  }
}
