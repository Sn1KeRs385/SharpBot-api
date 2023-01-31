import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'
import ChannelRepository from '~apps/shared/repositories/channel-repository'

const getChannelId = (app: AppContainer): number => {
  const channelId = app.getRequest().getParam('channelId')

  if (!channelId || !parseInt(channelId.toString())) {
    throw new Error('Идентификатор канала не найден')
  }

  return parseInt(channelId.toString())
}

export default async (app: AppContainer) => {
  const channel = await ChannelRepository.firstOrFail({
    id: getChannelId(app),
    user_id: app.getUser().id,
  })

  await ChannelRepository.remove(channel)

  app.setRedirectRoute(getRouteByName('ChannelsIndex'))
}
