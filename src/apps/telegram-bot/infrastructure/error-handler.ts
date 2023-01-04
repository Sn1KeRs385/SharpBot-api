import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { logError } from '~apps/telegram-bot/infrastructure/logger'

export const handleError = async (appContainer: AppContainer, error: unknown) => {
  await logError(appContainer, error)
}

export const useErrorHandler = async (appContainer: AppContainer, fn: () => void) => {
  try {
    await fn()
  } catch (error) {
    await handleError(appContainer, error)
  }
}
