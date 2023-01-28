import { Knex } from 'knex'
import UserIdentifierType from '~apps/shared/enums/user-identifier-type'
import WithTimestamps from '~database/migrations/helpers/with-timestamps'
import SoftDelete from '~database/migrations/helpers/soft-delete'
import WithId from '~database/migrations/helpers/with-id'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('user_identifiers', (table) => {
      WithId(table)
      table.bigint('user_id').unsigned().notNullable()
      table.enu('type', Object.values(UserIdentifierType)).notNullable()
      table.string('value').notNullable()
      WithTimestamps(table)
      SoftDelete(table)

      table.foreign('user_id').references('id').inTable('users')
      table.index(['value', 'type'])
    })
    .alterTable('user_identifiers', (table) => {
      table.string('type').alter()
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_identifiers')
}
