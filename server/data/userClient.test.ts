import describeClient from '../testutils/describeClient'
import { cas2v2UserDtoFactory } from '../testutils/factories'
import UserClient from './userClient'

describeClient('UserClient', provider => {
  let userClient: UserClient

  const token = 'token-1'

  beforeEach(() => {
    userClient = new UserClient(token)
  })

  describe('getUserDetails', () => {
    it('should details of a user', async () => {
      const username = 'testuser'
      const userDetails = cas2v2UserDtoFactory.build({ username })

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request to search for a person',
        withRequest: {
          method: 'GET',
          path: `/cas2/users/${username}`,
          query: {},
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: userDetails,
        },
      })

      const result = await userClient.getUserDetails(username)

      expect(result).toEqual(userDetails)
    })
  })
})
