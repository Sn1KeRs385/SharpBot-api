require('dotenv').config()

import type { Knex } from 'knex'
import DbConfig from './src/config/database'

const defaultConnection = DbConfig.connections[DbConfig.default]

const config: Knex.Config = {
  client: defaultConnection.client,
  connection: {
    database: defaultConnection.database,
    user: defaultConnection.user,
    password: defaultConnection.password,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    extension: 'ts',
    directory: 'src/database/migrations',
  },
  seeds: {
    extension: 'ts',
    directory: 'src/database/seeders',
  },
}

export default config
