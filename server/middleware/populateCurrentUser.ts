import { RequestHandler } from 'express'
import { jwtDecode } from 'jwt-decode'
import logger from '../../logger'
import UserService from '../services/userService'

export default function populateCurrentUser(userService: UserService): RequestHandler {
  return async (_, res, next) => {
    try {
      if (res.locals.user) {
        const user = await userService.getUser(res.locals.user.token)
        const { authorities: roles = [], user_uuid: userUuid } = jwtDecode<{
          authorities?: string[]
          user_uuid?: unknown
        }>(res.locals.user.token)
        if (typeof userUuid !== 'string' || !userUuid.trim()) {
          logger.warn('Authenticated user token does not contain a user_uuid')
        }
        if (user) {
          res.locals.user = {
            ...user,
            ...res.locals.user,
            userUuid: typeof userUuid === 'string' && userUuid.trim() ? userUuid : undefined,
            userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
          }
        } else {
          logger.info('No user available')
        }
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve user for: ${res.locals.user?.userId}`)
      next(error)
    }
  }
}
