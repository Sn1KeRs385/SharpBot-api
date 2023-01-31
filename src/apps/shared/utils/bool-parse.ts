export default (value: string | number | boolean | undefined | null) => {
  if (!value) {
    return false
  }

  if (typeof value === 'string') {
    value.toLowerCase()
  }

  return ['true', 'yes', 'on', '1', 1, true].includes(value)
}
