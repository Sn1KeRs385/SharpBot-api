import AddChannelByIdsAction from '~apps/telegram-bot/actions/channels/add-channel-by-ids-action'
import IndexAction from '~apps/telegram-bot/actions/channels/index-action'
import AddChannelByInviteLink from '~apps/telegram-bot/actions/channels/add-channel-by-invite-link'
import EditAction from '~apps/telegram-bot/actions/channels/edit-action'
import DeleteAction from '~apps/telegram-bot/actions/channels/delete-action'

export default [
  {
    name: 'ChannelsIndex',
    path: '/chs',
    action: IndexAction,
    middlewares: [],
  },
  {
    name: 'ChannelsEdit',
    path: '/chs_edit',
    action: EditAction,
    middlewares: [],
  },
  {
    name: 'ChannelsDelete',
    path: '/chs_delete',
    action: DeleteAction,
    middlewares: [],
  },
  {
    name: 'ChannelsAddChannelByIds',
    path: '/chs_add_ch_by_ids',
    action: AddChannelByIdsAction,
    middlewares: [],
  },
  {
    name: 'ChannelsAddChannelByInviteLink',
    path: '/chs_add_ch_by_inv_lnk',
    action: AddChannelByInviteLink,
    middlewares: [],
  },
]
