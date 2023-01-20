import StartAction from '~apps/telegram-bot/actions/init/start-action'

export default [
  {
    name: 'InitStart',
    path: '/start',
    action: StartAction,
    middlewares: [],
  },
]
