import PersonClient from './personClient'
import { personFactory } from '../testutils/factories'

import describeClient from '../testutils/describeClient'

describeClient('PersonClient', provider => {
  let personClient: PersonClient

  const token = 'token-1'

  beforeEach(() => {
    personClient = new PersonClient(token)
  })

  describe('search', () => {
    it('should return a person', async () => {
      const person = personFactory.build()

      provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request to search for a person',
        withRequest: {
          method: 'GET',
          path: `/cas2v2/people/search`,
          query: {
            nomsNumber: 'nomsNumber',
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: person,
        },
      })

      const result = await personClient.search('nomsNumber')

      expect(result).toEqual(person)
    })
  })
})
