import AppContainer from '~apps/telegram-bot/infrastructure/app-container'

export default interface Route {
  name: string
  path: string
  nextPath?: string
  action: (appContainer: AppContainer) => void
  middlewares: ((appContainer: AppContainer) => void)[]
}
