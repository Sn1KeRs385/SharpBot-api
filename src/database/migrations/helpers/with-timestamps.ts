import { Knex } from 'knex'
import DB from '~apps/shared/infrastructure/database'
import CreateTableBuilder = Knex.CreateTableBuilder

export default (table: CreateTableBuilder) => {
  table
    .timestamp('created_at', { useTz: false })
    .notNullable()
    .defaultTo(DB.fn.now())
  table
    .timestamp('updated_at', { useTz: false })
    .notNullable()
    .defaultTo(DB.fn.now())
}
