import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import DomesticAbuseConcerns from './detailsOfDomesticAbuseConcerns'

describe('DomesticAbuseConcerns', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new DomesticAbuseConcerns({}, application)

      expect(page.title).toEqual('Add concerns related to domestic abuse')
    })
  })

  itShouldHaveNextValue(new DomesticAbuseConcerns({}, application), 'violence-and-arson')
  itShouldHavePreviousValue(new DomesticAbuseConcerns({}, application), 'domestic-abuse-concerns')

  describe('errors', () => {
    const requiredFields = [
      ['victimDetails', 'Enter the details of any known victims'],
      ['safeguarding', 'Select yes if there are any safeguarding measures or professional teams involved'],
    ]

    it.each(requiredFields)(
      'it includes a validation error for %s, when an answer is not selected',
      (field, message) => {
        const page = new DomesticAbuseConcerns({}, application)
        const errors = page.errors()

        expect(errors[field as keyof typeof errors]).toEqual(message)
      },
    )

    describe('when safeguarding is _YES_', () => {
      it('returns an error if detail is not provided', () => {
        const page = new DomesticAbuseConcerns({ safeguarding: 'yes', safeguardingDetail: null }, application)

        expect(page.errors()).toHaveProperty(
          'safeguardingDetail',
          'Enter the details of any safeguarding measures or involvement of professional teams',
        )
      })
    })
  })

  describe('onSave', () => {
    describe('when safeguarding is _NO_', () => {
      it('removes the follow up data', () => {
        const page = new DomesticAbuseConcerns({ safeguarding: 'no', safeguardingDetail: 'Detail' }, application)

        page.onSave()

        expect(page.body).toEqual({
          safeguarding: 'no',
        })
      })
    })
  })
})
