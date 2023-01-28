import { Knex } from 'knex'

type BaseEntity<Entity> = {
  [Key in keyof Entity]: Entity[Key]
}

export default BaseEntity
