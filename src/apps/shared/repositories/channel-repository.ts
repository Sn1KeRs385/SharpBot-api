import BaseRepository from '~apps/shared/repositories/base-repository'
import Channel from '~apps/shared/interfaces/entities/channel'

class ChannelRepository extends BaseRepository<Channel> {
  protected readonly table = 'channels'
}

const instance = new ChannelRepository()
export default instance
