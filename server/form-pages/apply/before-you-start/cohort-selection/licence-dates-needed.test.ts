import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { applicationFactory, personFactory } from '../../../../testutils/factories'
import LicenceDatesNeeded from './licence-dates-needed'

describe('LicenceDatesNeeded', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const page = new LicenceDatesNeeded({}, application)
  const yesPage = new LicenceDatesNeeded({ licenceDatesNeeded: 'yes' }, application)

  describe('questions', () => {
    it('Returns the correct questions', () => {
      expect(page.questions).toEqual({ licenceDatesNeeded: 'Is Roger Smith on licence for a different offence?' })
    })
  })

  describe('title', () => {
    it('Has the correct title', () => {
      expect(page.title).toEqual('Is Roger Smith on licence for a different offence?')
    })
  })

  describe('Routing', () => {
    itShouldHaveNextValue(page, '')
    itShouldHavePreviousValue(page, 'cohort-selection')
  })

  describe('Errors', () => {
    it('Returns error if the question is not answered', () => {
      expect(page.errors()).toEqual({
        licenceDatesNeeded: 'Select yes if Roger Smith is on licence for a different offence',
      })
    })

    it('Returns no error if the question is answered', () => {
      expect(yesPage.errors()).toEqual({})
    })
  })

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      expect(yesPage.items()).toEqual([
        {
          checked: true,
          text: 'Yes',
          value: 'yes',
        },
        {
          checked: false,
          text: 'No',
          value: 'no',
        },
      ])
    })
  })
})
