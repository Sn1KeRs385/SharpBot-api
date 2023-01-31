import { Knex } from 'knex'
import WithId from '~database/migrations/helpers/with-id'
import WithTimestamps from '~database/migrations/helpers/with-timestamps'
import SoftDelete from '~database/migrations/helpers/soft-delete'
import ChannelType from '~apps/shared/enums/channel-type'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('channels', (table) => {
    WithId(table)
    table.bigint('user_id').unsigned().notNullable()
    table.string('title').notNullable()
    table.enu('type', Object.values(ChannelType)).notNullable()
    table.string('identifier').notNullable()
    table.bigint('bot_id').notNullable()
    WithTimestamps(table)
    SoftDelete(table)

    table.foreign('user_id').references('id').inTable('users')
    table.foreign('bot_id').references('id').inTable('tg_bots')
    table.index(['user_id', 'type', 'identifier'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('channels')
}
