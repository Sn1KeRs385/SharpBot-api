import AppContainer from '~apps/telegram-bot/infrastructure/app-container'

export const logSuccess = async (appContainer: AppContainer) => {
  console.info({
    result: 'success',
    app: appContainer,
  })
}

export const logError = async (appContainer: AppContainer, error: unknown) => {
  console.info({
    result: 'error',
    app: appContainer,
    error,
  })
}
