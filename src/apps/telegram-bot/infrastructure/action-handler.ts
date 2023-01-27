import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api'
import { getRouteByPath } from '~apps/telegram-bot/routes'
import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { useErrorHandler } from '~apps/telegram-bot/infrastructure/error-handler'
import RouteNotFoundError from '~apps/telegram-bot/errors/route-not-found-error'
import { logSuccess } from '~apps/telegram-bot/infrastructure/logger'
import WithUser from '~apps/telegram-bot/middlewares/with-user'
import WithState from '~apps/telegram-bot/middlewares/with-state'
import Route from '~apps/telegram-bot/interfaces/route'
import TgRequest from '~apps/telegram-bot/infrastructure/requests/tg-request'

const useAfterActionCallbacks = async (
  app: AppContainer,
  isSuccess: boolean
) => {
  const afterActionHooks = app.getAfterActionHooks()
  for (let i = 0; i < afterActionHooks.length; i++) {
    await afterActionHooks[i](isSuccess)
  }
}

const useMiddlewares = async (
  app: AppContainer,
  middlewares: ((appContainer: AppContainer) => void)[]
) => {
  for (let i = 0; i < middlewares.length; i++) {
    await middlewares[i](app)
  }
}

const trySearchRoute = (app: AppContainer) => {
  ;[
    trySearchRouteFromRequest,
    trySearchRouteFromState,
    trySearchRouteFromHistory,
  ].forEach((trySearchMethod) => {
    if (!app.getRoute()) {
      trySearchMethod(app)
    }
  })
}
const trySearchRouteFromRequest = (app: AppContainer) => {
  const route = app.getRequest().getRoute()
  if (!route) {
    return
  }

  app.setRoute(route)
}

const trySearchRouteFromHistory = (app: AppContainer) => {
  const lastRoutePath = app.getState().getPrevRoutePathHistory()
  if (!lastRoutePath) {
    return
  }

  const route = getRouteByPath(lastRoutePath)

  if (route && route.nextPath) {
    const nextRoute = getRouteByPath(route.nextPath)
    app.setRoute(nextRoute)
  }
}

const trySearchRouteFromState = (app: AppContainer) => {
  const nextRoutePath = app.getState().getNextRoutePath()
  if (!nextRoutePath) {
    return
  }

  const route = getRouteByPath(nextRoutePath)
  app.getState().clearNextRoutePath()

  if (route) {
    app.setRoute(route)
  }
}

const handleAction = async (app: AppContainer) => {
  await useMiddlewares(app, [WithUser, WithState])

  if (!app.getRoute()) {
    trySearchRoute(app)
  }

  if (!app.getRoute()) {
    throw RouteNotFoundError
  }

  const route = app.getRouteOrError()

  const middlewares: ((appContainer: AppContainer) => void)[] = []

  route.middlewares.forEach((routeMiddleware) => {
    middlewares.push(routeMiddleware)
  })

  await useMiddlewares(app, middlewares)

  await route.action(app)
}

export const handleText = async (
  bot: TelegramBot,
  message: Message,
  toRoute?: Route
) => {
  const request = new TgRequest(message.chat.id)
  request.setMessage(message)
  const app = new AppContainer(bot, request)

  const successAction = await useErrorHandler(app, async () => {
    if (toRoute) {
      app.setRoute(toRoute)
    }

    await handleAction(app)
  })

  const successAfterActionCallbacks = await useErrorHandler(app, async () => {
    await useAfterActionCallbacks(app, successAction)
  })

  if (successAction && successAfterActionCallbacks) {
    await useErrorHandler(app, async () => {
      await logSuccess(app)
    })
  }

  if (app.getRedirectRoute()) {
    await handleText(bot, message, app.getRedirectRoute())
  }
}

export const handleCallbackQuery = async (
  bot: TelegramBot,
  callbackQuery: CallbackQuery,
  toRoute?: Route
) => {
  if (!callbackQuery.message?.chat.id) {
    return
  }

  const request = new TgRequest(callbackQuery.message.chat.id)
  request.setCallbackQuery(callbackQuery)
  const app = new AppContainer(bot, request)

  const successAction = await useErrorHandler(app, async () => {
    if (toRoute) {
      app.setRoute(toRoute)
    }

    await handleAction(app)

    const message = app.getRequest().getMessage()
    if (message) {
      await app
        .getBot()
        .deleteMessage(message.chat.id, message.message_id.toString())
    }
  })

  const successAfterActionCallbacks = await useErrorHandler(app, async () => {
    await useAfterActionCallbacks(app, successAction)
  })

  if (successAction && successAfterActionCallbacks) {
    await useErrorHandler(app, async () => {
      await logSuccess(app)
    })
  }

  if (app.getRedirectRoute()) {
    await handleCallbackQuery(bot, callbackQuery, app.getRedirectRoute())
  }
}
