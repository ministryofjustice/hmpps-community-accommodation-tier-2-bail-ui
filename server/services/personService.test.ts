import {
  cas2OAsysRoshRatingsDtoFactory,
  cas2OAsysRoshSummaryDtoFactory,
  personFactory,
} from '../testutils/factories'
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

  describe('getOasysRosh', () => {
    it('maps the RoSH summary if there is a finishend assessment', async () => {
      const summary = cas2OAsysRoshSummaryDtoFactory.build({
        whoIsAtRisk: 'who is at risk',
        natureOfRisk: 'nature of risk',
        metadata: { hasApplicableAssessment: true, dateStarted: '2026-01-01', dateCompleted: '2026-01-02' },
      })
      personClient.oasysRoshSummary.mockResolvedValue(summary)

      const result = await service.getOasysRosh(token, 'crn')

      expect(result).toEqual({
        assessmentId: null,
        assessmentState: 'Completed',
        dateStarted: '2026-01-01',
        dateCompleted: '2026-01-02',
        rosh: [
          { questionNumber: 'R10.1', label: 'Who is at risk', answer: 'who is at risk' },
          { questionNumber: 'R10.2', label: 'What is the nature of the risk', answer: 'nature of risk' },
        ],
      })

      expect(personClientFactory).toHaveBeenCalledWith(token)
      expect(personClient.oasysRoshSummary).toHaveBeenCalledWith('crn')
    })

    it('marks the assessment as incomplete if there is no completed date', async () => {
      const summary = cas2OAsysRoshSummaryDtoFactory.build({
        metadata: { hasApplicableAssessment: true, dateStarted: '2026-01-01' },
      })
      delete summary.metadata.dateCompleted
      personClient.oasysRoshSummary.mockResolvedValue(summary)

      const result = await service.getOasysRosh(token, 'crn')

      expect(result.assessmentState).toEqual('Incomplete')
      expect(result.dateCompleted).toBeUndefined()
    })

    it('returns null when there is no applicable assessment', async () => {
      const summary = cas2OAsysRoshSummaryDtoFactory.build({ metadata: { hasApplicableAssessment: false } })
      personClient.oasysRoshSummary.mockResolvedValue(summary)

      const result = await service.getOasysRosh(token, 'crn')

      expect(result).toBeNull()
    })
  })

  describe('getRoshRisks', () => {
    it('maps the risk ratings to human-readable levels when there is an applicable assessment', async () => {
      const ratings = cas2OAsysRoshRatingsDtoFactory.build({
        overallRisk: 'very_high',
        riskToChildren: 'high',
        riskToPublic: 'medium',
        riskToKnownAdult: 'low',
        riskToStaff: 'high',
        metadata: { hasApplicableAssessment: true },
      })
      personClient.oasysRoshRatings.mockResolvedValue(ratings)

      const result = await service.getRoshRisks(token, 'crn')

      expect(result).toEqual({
        status: 'retrieved',
        value: {
          overallRisk: 'Very High',
          riskToChildren: 'High',
          riskToPublic: 'Medium',
          riskToKnownAdult: 'Low',
          riskToStaff: 'High',
        },
      })

      expect(personClientFactory).toHaveBeenCalledWith(token)
      expect(personClient.oasysRoshRatings).toHaveBeenCalledWith('crn')
    })

    it('returns a not_found envelope when there is no applicable assessment', async () => {
      const ratings = cas2OAsysRoshRatingsDtoFactory.build({ metadata: { hasApplicableAssessment: false } })
      personClient.oasysRoshRatings.mockResolvedValue(ratings)

      const result = await service.getRoshRisks(token, 'crn')

      expect(result).toEqual({ status: 'not_found' })
    })
  })
})
