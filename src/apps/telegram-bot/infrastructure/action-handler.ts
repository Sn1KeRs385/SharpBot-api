import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api'
import routers from '~apps/telegram-bot/routers'
import AppContainer from '~apps/telegram-bot/infrastructure/app-container'
import { useErrorHandler } from '~apps/telegram-bot/infrastructure/error-handler'
import ActionNotFoundError from '~apps/telegram-bot/errors/action-not-found-error'
import RouterNotFoundError from '~apps/telegram-bot/errors/router-not-found-error'
import ManyRouterFoundError from '~apps/telegram-bot/errors/many-router-found-error'
import { logSuccess } from '~apps/telegram-bot/infrastructure/logger'

const handleAction = async (appContainer: AppContainer) => {
  const message = appContainer.getMessage()
  if (
    !appContainer.getAction() &&
    message.text &&
    message.text.search(/\/.*/) === 0
  ) {
    appContainer.setAction(message.text)
  }

  if (!appContainer.getAction()) {
    throw ActionNotFoundError
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const findRouters = routers.filter(
    (router) => appContainer.getActionOrError().search(router.route) === 0
  )

  if (findRouters.length === 0) {
    throw RouterNotFoundError
  }
  if (findRouters.length > 1) {
    throw ManyRouterFoundError
  }

  const router = findRouters[0]

  for (let i = 0; i < router.middlewares.length; i++) {
    await router.middlewares[i](appContainer)
  }

  await router.action(appContainer)
}

export const handleText = async (bot: TelegramBot, message: Message) => {
  const appContainer = new AppContainer(bot)

  await useErrorHandler(appContainer, async () => {
    appContainer.setMessage(message)

    await handleAction(appContainer)

    await logSuccess(appContainer)
  })
}

export const handleCallbackQuery = async (
  bot: TelegramBot,
  callbackQuery: CallbackQuery
) => {
  const appContainer = new AppContainer(bot)

  await useErrorHandler(appContainer, async () => {
    if (callbackQuery.message) {
      appContainer.setMessage(callbackQuery.message)
    }
    if (callbackQuery.data) {
      appContainer.setAction(callbackQuery.data)
    }

    await handleAction(appContainer)

    await bot.deleteMessage(
      appContainer.getMessage().chat.id,
      appContainer.getMessage().message_id.toString()
    )

    await logSuccess(appContainer)
  })
}
