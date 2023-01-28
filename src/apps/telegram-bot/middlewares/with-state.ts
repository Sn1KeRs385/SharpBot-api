import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import * as UserStateService from '~apps/shared/services/user-state-service'
import State from '~apps/telegram-bot/infrastructure/state'

export default async (app: AppContainer) => {
  const stateData = await UserStateService.getState(app.getUser().id)

  const state = new State(stateData?.data || {})

  app.setState(state)

  app.addAfterActionHook(async (isSuccess) => {
    if (isSuccess) {
      app.getState().addRoutePathToHistory(app.getRouteOrError().path)
      await UserStateService.saveState(app.getUser().id, app.getState())
    }
  })
}
