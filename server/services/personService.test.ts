import { personFactory } from '../testutils/factories'
import PersonService from './personService'
import { PersonClient } from '../data'

jest.mock('../data/personClient.ts')

describe('Person Service', () => {
  const personClient = new PersonClient(null) as jest.Mocked<PersonClient>
  const personClientFactory = jest.fn()

  const service = new PersonService(personClientFactory)

  const token = 'SOME_TOKEN'

  beforeEach(() => {
    jest.resetAllMocks()
    personClientFactory.mockReturnValue(personClient)
  })

  describe('findByPrisonNumber', () => {
    it('on success returns the person given their prison number', async () => {
      const person = personFactory.build()
      personClient.searchByPrisonNumber.mockResolvedValue(person)

      const postedPerson = await service.findByPrisonNumber(token, 'prisonNumber')

      expect(postedPerson).toEqual(person)

      expect(personClientFactory).toHaveBeenCalledWith(token)
      expect(personClient.searchByPrisonNumber).toHaveBeenCalledWith('prisonNumber')
    })
  })

  describe('findByCrn', () => {
    it('on success returns the person given their crn', async () => {
      const person = personFactory.build()
      personClient.searchByCrn.mockResolvedValue(person)

      const postedPerson = await service.findByCrn(token, 'crn')

      expect(postedPerson).toEqual(person)

      expect(personClientFactory).toHaveBeenCalledWith(token)
      expect(personClient.searchByCrn).toHaveBeenCalledWith('crn')
    })
  })
})
