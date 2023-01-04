import { Knex } from 'knex'
import WithTimestamps from '~database/migrations/helpers/with-timestamps'
import SoftDelete from '~database/migrations/helpers/soft-delete'
import WithId from '~database/migrations/helpers/with-id'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    WithId(table)
    WithTimestamps(table)
    SoftDelete(table)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
