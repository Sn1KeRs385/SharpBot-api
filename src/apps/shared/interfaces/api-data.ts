import AnyType from '~apps/shared/interfaces/any-type'

export default interface ApiData {
  [key: string]: AnyType | AnyType[] | ApiData
}
