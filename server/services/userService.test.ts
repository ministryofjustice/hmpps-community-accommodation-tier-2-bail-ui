import UserService from './userService'
import HmppsAuthClient, { User } from '../data/hmppsAuthClient'
import { UserClient } from '../data'
import { cas2v2UserDtoFactory } from '../testutils/factories'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/userClient')

const token = 'some token'

describe('User service', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let userService: UserService
  const userClient = new UserClient(null) as jest.Mocked<UserClient>
  const userClientFactory = jest.fn()

  describe('getUser', () => {
    beforeEach(() => {
      hmppsAuthClient = new HmppsAuthClient() as jest.Mocked<HmppsAuthClient>
      userService = new UserService(hmppsAuthClient, userClientFactory)
    })
    it('Retrieves and formats user name', async () => {
      hmppsAuthClient.getUser.mockResolvedValue({ name: 'john smith' } as User)

      const result = await userService.getUser(token)

      expect(result.displayName).toEqual('John Smith')
    })
    it('Propagates error', async () => {
      hmppsAuthClient.getUser.mockRejectedValue(new Error('some error'))

      await expect(userService.getUser(token)).rejects.toEqual(new Error('some error'))
    })
  })

  describe('getUserDetails', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      hmppsAuthClient = new HmppsAuthClient() as jest.Mocked<HmppsAuthClient>
      userClientFactory.mockReturnValue(userClient)
      userService = new UserService(hmppsAuthClient, userClientFactory)
    })

    it('gets details for the user', async () => {
      const refUserDetails = cas2v2UserDtoFactory.build()
      userClient.getUserDetails.mockResolvedValue(refUserDetails)

      const userDetails = await userService.getUserDetails(token, refUserDetails.username)

      expect(userDetails).toEqual(refUserDetails)
    })
  })
})
