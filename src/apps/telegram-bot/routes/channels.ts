import AddChannelByIdsAction from '~apps/telegram-bot/actions/channels/add-channel-by-ids-action'
import IndexAction from '~apps/telegram-bot/actions/channels/index-action'
import AddChannelByInviteLink from '~apps/telegram-bot/actions/channels/add-channel-by-invite-link'

export default [
  {
    name: 'ChannelsIndex',
    path: '/ch_index',
    action: IndexAction,
    middlewares: [],
  },
  {
    name: 'ChannelsAddChannelByIds',
    path: '/ch_add_ch_by_ids',
    action: AddChannelByIdsAction,
    middlewares: [],
  },
  {
    name: 'ChannelsAddChannelByInviteLink',
    path: '/ch_add_ch_by_inv_lnk',
    action: AddChannelByInviteLink,
    middlewares: [],
  },
]
