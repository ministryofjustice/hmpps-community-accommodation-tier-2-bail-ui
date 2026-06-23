import { Cas2UserDto } from '@approved-premises/api'
import type HmppsAuthClient from '../data/hmppsAuthClient'
import { convertToTitleCase } from '../utils/utils'
import { RestClientBuilder } from '../data'
import UserClient from '../data/userClient'

export interface UserDetails {
  name: string
  displayName: string
}

export default class UserService {
  constructor(
    private readonly hmppsAuthClient: HmppsAuthClient,
    private readonly userClientFactory: RestClientBuilder<UserClient>,
  ) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsAuthClient.getUser(token)
    return { ...user, displayName: convertToTitleCase(user.name) }
  }

  async getUserDetails(token: string, userName: string): Promise<Cas2UserDto> {
    const userClient = this.userClientFactory(token)

    return userClient.getUserDetails(userName)
  }
}
