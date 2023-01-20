import knex from 'knex'
import DbConfig from '~config/database'

const pgConnection = DbConfig.connections.pg
export const pg = knex({
  client: pgConnection.client,
  connection: pgConnection,
})

export default pg
