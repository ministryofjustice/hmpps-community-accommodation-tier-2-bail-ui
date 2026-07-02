import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import Concerns from './concerns'

describe('Concerns', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new Concerns({}, application)

      expect(page.title).toEqual('Add information about concerns to Roger Smith and others')
    })
  })

  describe('routing', () => {
    itShouldHaveNextValue(new Concerns({}, application), 'self-harm')
    itShouldHavePreviousValue(new Concerns({}, application), 'taskList')
  })

  describe('isApplicable', () => {
    it('Returns true for a bail application', () => {
      expect(new Concerns({}, application).isApplicable()).toEqual(true)
    })

    it('Returns true for a non-bail application', () => {
      expect(new Concerns({}, applicationFactory.newCohort().build()).isApplicable()).toEqual(false)
    })
  })
})
