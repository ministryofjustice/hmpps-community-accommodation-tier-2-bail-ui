import PersonClient from './personClient'
import { cas2OAsysRoshRatingsDtoFactory, cas2OAsysRoshSummaryDtoFactory, personFactory } from '../testutils/factories'

import describeClient from '../testutils/describeClient'

describeClient('PersonClient', provider => {
  let personClient: PersonClient

  const token = 'token-1'

  const oasysMetadata = {
    dateStarted: '2026-01-01T00:00:00Z',
    dateCompleted: '2026-01-02T00:00:00Z',
    hasApplicableAssessment: true,
  }

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
          path: `/cas2/people/search-by-noms/nomsNumber`,
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
          path: `/cas2/people/search-by-crn/crn`,
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

  describe('oasysMetadata', () => {
    it('should return the OASys assessment metadata for a person', async () => {
      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: "A request for a person's OASys assessment metadata",
        withRequest: {
          method: 'GET',
          path: `/cas2/people/crn/oasys/metadata`,
          query: {},
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: oasysMetadata,
        },
      })

      const result = await personClient.oasysMetadata('crn')

      expect(result).toEqual(oasysMetadata)
    })
  })

  describe('oasysRoshRatings', () => {
    it('should return the OASys RoSH ratings for a person', async () => {
      const ratings = cas2OAsysRoshRatingsDtoFactory.build({ metadata: oasysMetadata })

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: "A request for a person's OASys RoSH ratings",
        withRequest: {
          method: 'GET',
          path: `/cas2/people/crn/oasys/rosh-ratings`,
          query: {},
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: ratings,
        },
      })

      const result = await personClient.oasysRoshRatings('crn')

      expect(result).toEqual(ratings)
    })
  })

  describe('oasysRoshSummary', () => {
    it('should return the OASys RoSH summary for a person', async () => {
      const summary = cas2OAsysRoshSummaryDtoFactory.build({ metadata: oasysMetadata })

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: "A request for a person's OASys RoSH summary",
        withRequest: {
          method: 'GET',
          path: `/cas2/people/crn/oasys/rosh-summary`,
          query: {},
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: summary,
        },
      })

      const result = await personClient.oasysRoshSummary('crn')

      expect(result).toEqual(summary)
    })
  })
})
