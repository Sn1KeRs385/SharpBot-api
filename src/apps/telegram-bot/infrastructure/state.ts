import stateConfig from '~config/state'

export default class State {
  protected routePathHistory: string[]
  protected nextRoutePath?: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options: { [key: string]: any }) {
    this.routePathHistory = []
    Object.assign(this, options)
  }

  public addRoutePathToHistory(oath: string): State {
    this.routePathHistory.unshift(oath)
    if (this.routePathHistory.length > stateConfig.routePathHistoryMaxLength) {
      this.routePathHistory = this.routePathHistory.slice(
        0,
        stateConfig.routePathHistoryMaxLength
      )
    }
    return this
  }

  public getRoutePathHistory(): string[] {
    return this.routePathHistory
  }

  public getRoutePathHistoryStep(step: number): string | undefined {
    if (this.routePathHistory.length < step) {
      return undefined
    }

    return this.routePathHistory[step]
  }

  public getPrevRoutePathHistory(): string | undefined {
    return this.getRoutePathHistoryStep(0)
  }

  public setNextRoutePath(path: string): State {
    this.nextRoutePath = path
    return this
  }

  public getNextRoutePath(): string | undefined {
    return this.nextRoutePath
  }

  public clearNextRoutePath(): State {
    this.nextRoutePath = undefined
    return this
  }
}
