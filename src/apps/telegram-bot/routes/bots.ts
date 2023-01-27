import IndexAction from '~apps/telegram-bot/actions/bots/index-action'
import AddAction from '~apps/telegram-bot/actions/bots/add-action'
import AddActionByApiKey from '~apps/telegram-bot/actions/bots/add-action-by-api-key'
import EditAction from '~apps/telegram-bot/actions/bots/edit-action'
import DeleteAction from '~apps/telegram-bot/actions/bots/delete-action'

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
  {
    name: 'BotsEdit',
    path: '/bots_edit',
    action: EditAction,
    middlewares: [],
  },
  {
    name: 'BotsDelete',
    path: '/bots_delete',
    action: DeleteAction,
    middlewares: [],
  },
]
