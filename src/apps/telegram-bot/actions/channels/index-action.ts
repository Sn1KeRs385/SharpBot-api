import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { getRouteByName } from '~apps/telegram-bot/routes'
import ChannelRepository from '~apps/shared/repositories/channel-repository'

export default async (app: AppContainer) => {
  const channels = await ChannelRepository.getList({
    user_id: app.getUser().id,
  })

  const buttons = channels.map((channel) => {
    return [
      {
        text: channel.title,
        callback_data:
          getRouteByName('ChannelsEdit').path + ` -channelId=${channel.id}`,
      },
    ]
  })

  await app
    .getBot()
    .sendMessage(app.getRequest().getChatId(), 'Управления каналами', {
      reply_markup: {
        inline_keyboard: [
          ...buttons,
          [
            {
              text: 'Назад',
              callback_data: getRouteByName('InitStart').path,
            },
          ],
        ],
      },
    })
}
