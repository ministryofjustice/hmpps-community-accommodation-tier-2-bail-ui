import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import AdditionalConcerns from './additionalConcerns'

describe('AdditionalConcerns', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new AdditionalConcerns({}, application)

      expect(page.title).toEqual('Add any additional concerns')
    })
  })

  itShouldHaveNextValue(new AdditionalConcerns({}, application), 'risk-management-arrangements')
  itShouldHavePreviousValue(new AdditionalConcerns({}, application), 'safety-of-staff')

  describe('errors', () => {
    describe('additionalConcerns', () => {
      it('returns an error when an answer is not provided', () => {
        const page = new AdditionalConcerns({ additionalConcerns: null }, application)

        expect(page.errors()).toHaveProperty(
          'additionalConcerns',
          'Select if there are any additional past or present concerns',
        )
      })

      it('returns an error when additional concerns contains answer "yes" but the follow-up is not provided', () => {
        const page = new AdditionalConcerns({ additionalConcerns: 'yes', additionalConcernsDetail: null }, application)

        expect(page.errors()).toHaveProperty('additionalConcernsDetail', 'Enter details of additional concerns')
      })
    })
  })

  describe('onSave', () => {
    describe('additional concerns', () => {
      it('removes additional concerns follow-up if the answer is not "yes"', () => {
        const page = new AdditionalConcerns(
          { additionalConcerns: 'no', additionalConcernsDetail: 'Detail' },
          application,
        )

        page.onSave()

        expect(page.body).toEqual({
          additionalConcerns: 'no',
        })
      })
    })
  })
})
