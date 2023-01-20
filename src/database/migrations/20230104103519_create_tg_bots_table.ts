import { Knex } from 'knex'
import WithId from '~database/migrations/helpers/with-id'
import WithTimestamps from '~database/migrations/helpers/with-timestamps'
import SoftDelete from '~database/migrations/helpers/soft-delete'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tg_bots', (table) => {
    WithId(table)
    table.bigint('user_id').unsigned().notNullable()
    table.string('api_key').notNullable()
    table.string('username').notNullable()
    table.string('name').notNullable()
    WithTimestamps(table)
    SoftDelete(table)

    table.foreign('user_id').references('id').inTable('users')
    table.index(['user_id', 'api_key'])
    table.index(['user_id', 'username'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tg_bots')
}
