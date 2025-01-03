import { Middleware } from 'redux'

export const loggerMiddleware: Middleware = store => next => action => {
  // @ts-expect-error "Unknown action type"
  console.group(action.type)
  console.info('dispatching', action)

  const result = next(action)

  console.log('next state', store.getState())
  console.groupEnd()

  return result
}
