import PersonClient from './personClient'
import { personFactory } from '../testutils/factories'

import describeClient from '../testutils/describeClient'

describeClient('PersonClient', provider => {
  let personClient: PersonClient

  const token = 'token-1'

  beforeEach(() => {
    personClient = new PersonClient(token)
  })

  describe('searchByPrisonNumber', () => {
    it('should return a person', async () => {
      const person = personFactory.build()

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request to search for a person',
        withRequest: {
          method: 'GET',
          path: `/cas2v2/people/search-by-noms/nomsNumber`,
          query: {},
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: person,
        },
      })

      const result = await personClient.searchByPrisonNumber('nomsNumber')

      expect(result).toEqual(person)
    })
  })

  describe('searchByCrn', () => {
    it('should return a person', async () => {
      const person = personFactory.build()

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request to search for a person',
        withRequest: {
          method: 'GET',
          path: `/cas2v2/people/search-by-crn/crn`,
          query: {},
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: person,
        },
      })

      const result = await personClient.searchByCrn('crn')

      expect(result).toEqual(person)
    })
  })
})
