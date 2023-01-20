import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { logError } from '~apps/telegram-bot/infrastructure/logger'
import UndefinedError from '~apps/telegram-bot/errors/undefined-error'
import BaseTelegramBotError from '~apps/telegram-bot/errors/base-telegram-bot-error'
import { getRouteByName } from '~apps/telegram-bot/routes'

export const handleError = async (app: AppContainer, error: Error) => {
  await logError(app, error)

  if (error instanceof BaseTelegramBotError) {
    await error.sendMessageToUser(app)
  } else {
    const undefineError = new UndefinedError()
    await undefineError.sendMessageToUser(app)
  }

  if (!app.getRedirectRoute()) {
    app.setRedirectRoute(getRouteByName('InitStart'))
  }
}

const getNormalizeError = (error: unknown): Error => {
  let errorComputed: Error | undefined
  if (error instanceof Error) {
    errorComputed = error
  } else {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const errorTemp = new error()
      if (errorTemp instanceof Error) {
        errorComputed = errorTemp
      }
    } catch (er) {
      /* empty */
    }
  }

  if (!errorComputed) {
    errorComputed = new UndefinedError()
  }

  return errorComputed
}

export const useErrorHandler = async (app: AppContainer, fn: () => void) => {
  try {
    await fn()
    return true
  } catch (error) {
    await handleError(app, getNormalizeError(error))
    return false
  }
}
