import IndexAction from '~apps/telegram-bot/actions/bots/index-action'
import AddAction from '~apps/telegram-bot/actions/bots/add-action'
import AddActionByApiKey from '~apps/telegram-bot/actions/bots/add-action-by-api-key'

export default [
  {
    name: 'BotsIndex',
    path: '/bots',
    action: IndexAction,
    middlewares: [],
  },
  {
    name: 'BotsAdd',
    path: '/bots_add',
    action: AddAction,
    middlewares: [],
  },
  {
    name: 'BotsAddByApiKey',
    path: '/bots_add_by_api_key',
    action: AddActionByApiKey,
    middlewares: [],
  },
]
