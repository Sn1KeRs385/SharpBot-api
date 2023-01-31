import DB from '~apps/shared/infrastructure/database'
import EntityNotFoundError from '~apps/shared/errors/entity-not-found-error'
import BaseEntity from '~apps/shared/interfaces/entities/base-entity'
import { Knex } from 'knex'
import KnexValue = Knex.Value
import TgBot from '~apps/shared/interfaces/entities/tg-bot'
import {
  timestampsOnCreate,
  timestampsOnUpdate,
  timestampsOnDelete,
} from '~apps/shared/infrastructure/entity-properties'
import WithTimestamps from '~apps/shared/interfaces/entities/helpers/with-timestamps'

export default abstract class BaseRepository<
  Entity extends BaseEntity<Entity>
> {
  protected abstract readonly table: string

  protected readonly primaryKey: keyof Entity | (keyof Entity)[] =
    'id' as keyof Entity

  protected readonly softDelete: boolean = true
  protected readonly useTimestamp: boolean = true

  public getBaseQuery(params: Partial<Entity>, withTrashed = false) {
    const query = DB<Entity>(this.table)

    Object.entries(params).forEach(([key, value]) => {
      query.where(key, value as KnexValue)
    })

    if (this.softDelete && !withTrashed) {
      query.whereNull('deleted_at')
    }

    return query
  }

  public getBaseEntityQuery(
    entity: Entity,
    params: Partial<Entity> = {},
    withTrashed = false
  ) {
    const query = this.getBaseQuery(params, withTrashed)

    if (Array.isArray(this.primaryKey)) {
      this.primaryKey.forEach((key) => {
        query.where(key, entity[key])
      })
    } else {
      query.where(this.primaryKey, entity[this.primaryKey])
    }

    return query
  }

  public first(params: Partial<Entity> = {}, withTrashed = false) {
    return this.getBaseQuery(params, withTrashed).first()
  }

  public async firstOrFail(
    params: Partial<Entity> = {},
    withTrashed = false
  ): Promise<Entity> {
    return this.first(params, withTrashed).then((result) => {
      if (!result) {
        throw new EntityNotFoundError(this.table, params)
      }
      return result
    }) as Promise<Entity>
  }

  public getList(params: Partial<Entity> = {}, withTrashed = false) {
    return this.getBaseQuery(params, withTrashed)
  }

  public remove(entity: Entity) {
    if (this.softDelete) {
      return (
        this.getBaseEntityQuery(entity)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .update(timestampsOnDelete())
          .returning('*')
          .then((result) => {
            entity = Object.assign(entity, result[0])
            return entity
          })
      )
    } else {
      return this.getBaseEntityQuery(entity)
        .delete()
        .then(() => {
          return null
        })
    }
  }

  public create(params: Partial<Entity>) {
    let data: WithTimestamps | Record<string, never> = {}
    if (this.useTimestamp) {
      data = timestampsOnCreate()
    }

    return (
      DB<Entity>(this.table)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .insert({ ...params, ...data })
        .returning('*')
        .then((result) => result[0])
    )
  }

  public createMany(paramsArray: Partial<Entity>[]) {
    const timestamps = timestampsOnCreate()
    const dataArray = paramsArray.map((params) => ({
      ...params,
      ...timestamps,
    }))

    return (
      DB<Entity>(this.table)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .insert(dataArray)
        .returning('*')
        .then((result) => result[0])
    )
  }

  public update(entity: Entity, params: Partial<Entity>) {
    let data: { updated_at: string } | Record<string, never> = {}
    if (this.useTimestamp) {
      data = timestampsOnUpdate()
    }

    return (
      this.getBaseEntityQuery(entity)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .update({ ...params, ...data })
        .returning('*')
        .then((result) => {
          entity = Object.assign(entity, result[0])
          return entity
        })
    )
  }

  public updateOrCreate(
    searchParams: Partial<Entity>,
    fillParams: Partial<Entity>
  ): Promise<Entity> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.first(searchParams).then((entity) => {
      if (entity) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.update(entity, fillParams)
      } else {
        return this.create({ ...searchParams, ...fillParams })
      }
    })
  }

  public firstOrCreate(
    searchParams: Partial<Entity>,
    fillParams: Partial<Entity>
  ): Promise<Entity> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.first(searchParams).then((entity) => {
      if (entity) {
        return entity
      } else {
        return this.create({ ...searchParams, ...fillParams })
      }
    })
  }
}
