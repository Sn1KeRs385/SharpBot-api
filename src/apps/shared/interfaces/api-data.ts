export default interface ApiData {
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | ApiData
    | ApiData[]
    | null
    | undefined
}
