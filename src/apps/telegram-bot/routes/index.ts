import BotFatherRoutes from '~apps/telegram-bot/routes/bot-father'
import BotsRoutes from '~apps/telegram-bot/routes/bots'
import InitRoutes from '~apps/telegram-bot/routes/init'
import RoutesObject from '~apps/telegram-bot/interfaces/routes-object'
import Route from '~apps/telegram-bot/interfaces/route'
import RouteNotFoundByNameError from '~apps/telegram-bot/errors/route-not-found-by-name-error'
import RouteNameDuplicationError from '~apps/telegram-bot/errors/route-name-duplication-error'
import RoutePathDuplicationError from '~apps/telegram-bot/errors/route-path-duplication-error'

const routesWithKeyName: RoutesObject = {}
const routesWithKeyPath: RoutesObject = {}

export const initRoutes = (): void => {
  ;[BotFatherRoutes, InitRoutes, BotsRoutes].forEach((routesTemp) => {
    routesTemp.forEach((routeTemp) => {
      if (routesWithKeyName[routeTemp.name]) {
        throw new RouteNameDuplicationError(routeTemp.name)
      }
      if (routesWithKeyPath[routeTemp.path]) {
        throw new RoutePathDuplicationError(routeTemp.path)
      }

      routesWithKeyName[routeTemp.name] = routeTemp
      routesWithKeyPath[routeTemp.path] = routeTemp
    })
  })
}

export const getRouteByName = (name: string): Route => {
  const route = routesWithKeyName[name]
  if (!route) {
    throw new RouteNotFoundByNameError(name)
  }

  return route
}

export const tryGetRouteByName = (name: string): Route | undefined => {
  try {
    return getRouteByName(name)
  } catch (error) {
    return undefined
  }
}

export const getRouteByPath = (path: string): Route => {
  const route = routesWithKeyPath[path]
  if (!route) {
    throw new RouteNotFoundByNameError(path)
  }

  return route
}

export const tryGetRouteByPath = (path: string): Route | undefined => {
  try {
    return getRouteByPath(path)
  } catch (error) {
    return undefined
  }
}
