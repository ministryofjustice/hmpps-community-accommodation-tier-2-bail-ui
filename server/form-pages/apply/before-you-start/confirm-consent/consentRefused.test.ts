import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import ConsentRefused from './consentRefused'

describe('ConsentRefused', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('sets the page title', () => {
      const page = new ConsentRefused({}, application)

      expect(page.title).toEqual('Roger Smith has not given their consent')
    })
  })

  itShouldHaveNextValue(new ConsentRefused({}, application), '')
  itShouldHavePreviousValue(new ConsentRefused({}, application), 'confirm-consent')

  describe('errors', () => {
    it('returns empty errors object', () => {
      const page = new ConsentRefused({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
