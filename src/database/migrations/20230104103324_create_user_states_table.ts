import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_states', (table) => {
    table.bigint('user_id').unsigned().notNullable()
    table.jsonb('data').notNullable()

    table.primary(['user_id'])
    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_states')
}
