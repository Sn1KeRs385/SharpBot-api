import StartAction from '~apps/telegram-bot/actions/init/start-action'
import WithUser from '~apps/telegram-bot/middlewares/with-user'

export default [
  {
    route: /\/start/,
    action: StartAction,
    middlewares: [WithUser],
  },
]
