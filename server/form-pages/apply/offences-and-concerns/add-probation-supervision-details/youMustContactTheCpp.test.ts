import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import YouMustContactTheCpp from './youMustContactTheCpp'

describe('YouMustContactTheCpp', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('sets the page title', () => {
      const page = new YouMustContactTheCpp({}, application)

      expect(page.title).toEqual('You must contact the CPP before entering the risk levels')
    })
  })

  itShouldHaveNextValue(new YouMustContactTheCpp({}, application), '')
  itShouldHavePreviousValue(new YouMustContactTheCpp({}, application), 'contacted-cpp-about-current-risk-levels')

  describe('errors', () => {
    it('returns empty errors object', () => {
      const page = new YouMustContactTheCpp({}, application)

      expect(page.errors()).toEqual({})
    })
  })
})
