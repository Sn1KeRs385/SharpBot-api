import DeleteFromSelfChatAction from '~apps/telegram-bot/actions/messages/delete-from-self-chat-action'

export default [
  {
    name: 'MessagesDeleteFromSelfChat',
    path: '/msg_del_from_self_chat',
    action: DeleteFromSelfChatAction,
    middlewares: [],
  },
]
