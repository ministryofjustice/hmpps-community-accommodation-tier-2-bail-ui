import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import BrainInjury from './brainInjury'

describe('BrainInjury', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new BrainInjury({}, application)

      expect(page.title).toEqual('Does Roger Smith have a brain injury?')
    })
  })

  itShouldHavePreviousValue(new BrainInjury({}, application), 'learning-difficulties')
  describe('when there are concerns', () => {
    itShouldHaveNextValue(new BrainInjury({ hasBrainInjury: 'yes' }, application), 'brain-injury-details')
  })
  describe('when there are no concerns', () => {
    itShouldHaveNextValue(new BrainInjury({ hasBrainInjury: 'no' }, application), 'other-health')
  })

  describe('errors', () => {
    it('returns an error if no answer is provided', () => {
      const page = new BrainInjury({ hasBrainInjury: null }, application)

      expect(page.errors()).toHaveProperty('hasBrainInjury', 'Select yes if they have any brain injury')
    })
  })
})
