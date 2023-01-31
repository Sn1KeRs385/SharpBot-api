import FromBotFatherAction from '~apps/telegram-bot/actions/forward-message/from-bot-father-action'
import FromChatAction from '~apps/telegram-bot/actions/forward-message/from-chat-action'

export default [
  {
    name: 'ForwardMessageFromBotFather',
    path: '/fm_from_bot_father',
    action: FromBotFatherAction,
    middlewares: [],
  },
  {
    name: 'ForwardMessageFromChat',
    path: '/fm_from_chat',
    action: FromChatAction,
    middlewares: [],
  },
]
