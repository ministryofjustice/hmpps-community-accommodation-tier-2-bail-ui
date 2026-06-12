import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CohortSelection, { CohortSelectionBody } from './cohortSelection'

describe('ConsentRefused', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const bodyEmpty = {} as CohortSelectionBody
  const bodyIsc: CohortSelectionBody = { cohort: 'isc', notes: 'some notes' }

  it('sets the page title', () => {
    const page = new CohortSelection(bodyEmpty, application)

    expect(page.title).toEqual('Why does Roger Smith need CAS2 accommodation?')
  })

  describe('Routing', () => {
    itShouldHaveNextValue(new CohortSelection(bodyEmpty, application), '')
    itShouldHavePreviousValue(new CohortSelection(bodyEmpty, application), 'taskList')
  })

  describe('errors', () => {
    it('returns empty errors object', () => {
      const page = new CohortSelection(bodyIsc, application)

      expect(page.errors()).toEqual({})
    })

    it('returns error if cohort not completed', () => {
      const page = new CohortSelection(bodyEmpty, application)

      expect(page.errors()).toEqual({ cohort: 'Select why Roger Smith needs CAS2 accommodation' })
    })
  })

  describe('response', () => {
    it('gets the response from the body', () => {
      expect(new CohortSelection(bodyIsc, application).response()).toEqual({
        'Provide details (optional)': 'some notes',
        'Why does Roger Smith need CAS2 accommodation?': 'Intensive supervision courts (ISC)',
      })
    })
  })
})
