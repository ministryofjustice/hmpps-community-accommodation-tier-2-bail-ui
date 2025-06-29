import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'

export interface User {
  name: string
  activeCaseLoadId: string
}

export interface UserRole {
  roleCode: string
}

export default class HmppsAuthClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('HMPPS Auth Client', config.apis.hmppsAuth, token)
  }

  getUser(token: string): Promise<User> {
    logger.info(`Getting user details: calling HMPPS Auth`)
    return HmppsAuthClient.restClient(token).get({ path: '/api/user/me' }) as Promise<User>
  }
}
