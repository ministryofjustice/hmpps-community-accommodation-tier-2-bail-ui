import { Cas2UserDto } from '@approved-premises/api'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import paths from '../paths/api'

export default class UserClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('userClient', config.apis.approvedPremises as ApiConfig, token)
  }

  async getUserDetails(userName: string): Promise<Cas2UserDto> {
    return this.restClient.get<Cas2UserDto>({ path: paths.users.get({ userName }) })
  }
}
