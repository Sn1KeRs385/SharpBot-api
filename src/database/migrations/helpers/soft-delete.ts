import { Knex } from 'knex'
import CreateTableBuilder = Knex.CreateTableBuilder

export default (table: CreateTableBuilder) => {
  table.timestamp('deleted_at', { useTz: false })
}
