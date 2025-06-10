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

  describe('response', () => {
    describe('when _hasBrainInjury_ is set to NO', () => {
      it('returns only that question', () => {
        const page = new BrainInjury({ hasBrainInjury: 'no' }, application)

        expect(page.response()).toEqual({
          'Does Roger Smith have a brain injury?': 'No',
        })
      })
    })

    describe('when _hasBrainInjury_ is set to YES', () => {
      application.data = {
        'health-needs': {
          'brain-injury': {
            hasBrainInjury: 'yes',
          },
          'brain-injury-details': {
            injuryDetail: 'some injury details',
            supportNeeded: 'yes',
            supportDetail: 'some support details',
            receivingTreatment: 'yes',
            treatmentDetail: 'some treatment details',
            isVulnerable: 'yes',
            vulnerabilityDetail: 'some vulnerability details',
            hasDifficultyInteracting: 'yes',
            interactionDetail: 'some interaction details',
          },
        },
      }

      it('returns questions and answers for both brain injury pages', () => {
        const page = new BrainInjury({ hasBrainInjury: 'yes' }, application)

        expect(page.response()).toEqual({
          'Does Roger Smith have a brain injury?': 'Yes',
          'Enter details of their brain injury': 'some injury details',
          'Do they need any support as a result of this?': 'Yes',
          'Enter details of the type of support needed, including any support they have already or will need':
            'some support details',
          'Do they receive any treatment for this?': 'Yes',
          'Enter details about their treatment': 'some treatment details',
          'Are they vulnerable as a result of this?': 'Yes',
          'Enter details of how they might be vulnerable': 'some vulnerability details',
          'Do they have difficulties interacting with other people as a result of their injury?': 'Yes',
          'Enter details of the type of difficulties they have': 'some interaction details',
        })
      })
    })
  })
})
