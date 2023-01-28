import { getCurrentTimestamp } from '~apps/shared/infrastructure/date'
import BaseEntity from '~apps/shared/interfaces/entities/base-entity'

export const timestampsOnCreate = () => {
  return {
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
  }
}

export const timestampsOnUpdate = () => {
  return {
    updated_at: getCurrentTimestamp(),
  }
}

export const timestampsOnDelete = () => {
  return {
    deleted_at: getCurrentTimestamp(),
  }
}
