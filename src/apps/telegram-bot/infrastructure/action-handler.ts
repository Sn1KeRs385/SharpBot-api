import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api'
import {
  getRouteByName,
  getRouteByPath,
  tryGetRouteByPath,
} from '~apps/telegram-bot/routes'
import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { useErrorHandler } from '~apps/telegram-bot/infrastructure/error-handler'
import RouteNotFoundError from '~apps/telegram-bot/errors/route-not-found-error'
import { logSuccess } from '~apps/telegram-bot/infrastructure/logger'
import WithUser from '~apps/telegram-bot/middlewares/with-user'
import WithState from '~apps/telegram-bot/middlewares/with-state'
import Route from '~apps/telegram-bot/interfaces/route'

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
  ;[trySearchRouteFromState, trySearchRouteFromHistory].forEach(
    (trySearchMethod) => {
      if (!app.getRoute()) {
        trySearchMethod(app)
      }
    }
  )
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
  const message = app.getMessage()
  if (!app.getRoute() && message.text && message.text.search(/\/.*/) === 0) {
    const route = tryGetRouteByPath(message.text.split(' ')[0])
    if (route) {
      app.setRoute(route)
    }
  }

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
  const app = new AppContainer(bot)

  const success = await useErrorHandler(app, async () => {
    app.setMessage(message)

    if (toRoute) {
      app.setRoute(toRoute)
    }

    await handleAction(app)

    await logSuccess(app)
  })

  await useErrorHandler(app, async () => {
    await useAfterActionCallbacks(app, success)
  })

  if (app.getRedirectRoute()) {
    await handleText(bot, message, app.getRedirectRoute())
  }
}

export const handleCallbackQuery = async (
  bot: TelegramBot,
  callbackQuery: CallbackQuery,
  toRoute?: Route
) => {
  const app = new AppContainer(bot)

  const success = await useErrorHandler(app, async () => {
    if (callbackQuery.message) {
      app.setMessage(callbackQuery.message)
    }

    if (toRoute) {
      app.setRoute(toRoute)
    }

    if (!app.getRoute() && callbackQuery.data) {
      const route = tryGetRouteByPath(callbackQuery.data)
      if (route) {
        app.setRoute(route)
      }
    }

    await handleAction(app)

    await bot.deleteMessage(
      app.getMessage().chat.id,
      app.getMessage().message_id.toString()
    )

    await logSuccess(app)
  })

  await useErrorHandler(app, async () => {
    await useAfterActionCallbacks(app, success)
  })

  if (app.getRedirectRoute()) {
    await handleCallbackQuery(bot, callbackQuery, app.getRedirectRoute())
  }
}
