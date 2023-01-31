import AddChannelByIdsAction from '~apps/telegram-bot/actions/channels/add-channel-by-ids-action'

export default [
  {
    name: 'ChannelsAddChannelByIds',
    path: '/ch_add_ch_by_ids',
    action: AddChannelByIdsAction,
    middlewares: [],
  },
]
