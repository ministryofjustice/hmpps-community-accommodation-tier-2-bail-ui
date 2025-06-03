import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import DomesticAbuse from './domesticAbuseConcerns'

describe('DomesticAbuse', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new DomesticAbuse({}, application)

      expect(page.title).toEqual('Concerns related to domestic abuse for Roger Smith')
    })
  })

  itShouldHavePreviousValue(new DomesticAbuse({}, application), 'does-the-applicant-have-acct-notes')
  describe('when there are concerns', () => {
    itShouldHaveNextValue(new DomesticAbuse({ areConcerns: 'yes' }, application), 'details-of-domestic-abuse-concerns')
  })
  describe('when there are no concerns', () => {
    itShouldHaveNextValue(new DomesticAbuse({ areConcerns: 'no' }, application), 'violence-and-arson')
  })

  describe('errors', () => {
    it('returns an error if no answer is provided', () => {
      const page = new DomesticAbuse({ areConcerns: null }, application)

      expect(page.errors()).toHaveProperty(
        'areConcerns',
        'Select yes if there are any concerns related to domestic abuse',
      )
    })
  })
})
