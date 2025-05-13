import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import SelfHarm from './selfHarm'

describe('SelfHarm', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new SelfHarm({}, application)

      expect(page.title).toEqual('Concerns of self-harm and suicide for Roger Smith')
    })
  })

  itShouldHaveNextValue(new SelfHarm({}, application), 'does-the-applicant-have-acct-notes')
  itShouldHavePreviousValue(new SelfHarm({}, application), 'concerns')

  describe('errors', () => {
    describe('pastHarm', () => {
      it('returns an error when an answer is not provided', () => {
        const page = new SelfHarm({ pastHarm: null }, application)

        expect(page.errors()).toHaveProperty(
          'pastHarm',
          'Select if they have self-harmed or attempted suicide in the past',
        )
      })

      it('returns an error when past harm contains answer "yes" but the follow-up is not provided', () => {
        const page = new SelfHarm({ pastHarm: 'yes', pastHarmDetail: null }, application)

        expect(page.errors()).toHaveProperty('pastHarmDetail', 'Enter details of the incident')
      })
    })

    describe('currentConcerns', () => {
      it('returns an error when an answer is not provided', () => {
        const page = new SelfHarm({ currentConcerns: null }, application)

        expect(page.errors()).toHaveProperty(
          'currentConcerns',
          'Select if there are current concerns of self-harm or suicide',
        )
      })

      it('returns an error when current concerns contains answer "yes" but the follow-up is not provided', () => {
        const page = new SelfHarm({ currentConcerns: 'yes', currentConcernsDetail: null }, application)

        expect(page.errors()).toHaveProperty('currentConcernsDetail', 'Enter details of current concerns')
      })
    })

    describe('specificTriggers', () => {
      it('returns an error when an answer is not provided', () => {
        const page = new SelfHarm({ specificTriggers: null }, application)

        expect(page.errors()).toHaveProperty(
          'specificTriggers',
          'Select if they have any triggers, or if it is not known',
        )
      })

      it('returns an error when specific triggers is answered "yes" but the follow-up is not provided', () => {
        const page = new SelfHarm({ specificTriggers: 'yes', specificTriggersDetail: null }, application)

        expect(page.errors()).toHaveProperty(
          'specificTriggersDetail',
          'Enter details about situations, topics and triggers',
        )
      })

      it('returns an error when specific triggers is answered "do not know" but the follow-up is not provided', () => {
        const page = new SelfHarm({ specificTriggers: 'dontKnow', specificTriggersNotKnownDetail: null }, application)

        expect(page.errors()).toHaveProperty('specificTriggersNotKnownDetail', 'Enter the reason why it is not known')
      })
    })
  })

  describe('Removes old data', () => {
    describe('Past harm', () => {
      it('removes past harm follow-up if the answer is not "yes"', () => {
        const page = new SelfHarm({ pastHarm: 'no', pastHarmDetail: 'Detail' }, application)

        page.onSave()

        expect(page.body).toEqual({
          pastHarm: 'no',
        })
      })
    })

    describe('Current concerns', () => {
      it('removes current concerns follow-up if the answer is not "yes"', () => {
        const page = new SelfHarm({ currentConcerns: 'no', currentConcernsDetail: 'Detail' }, application)

        page.onSave()

        expect(page.body).toEqual({
          currentConcerns: 'no',
        })
      })
    })

    describe('Specific triggers', () => {
      it('removes specific triggers follow-up if the answer is not "yes"', () => {
        const page = new SelfHarm({ specificTriggers: 'no', specificTriggersDetail: 'Detail' }, application)

        page.onSave()

        expect(page.body).toEqual({
          specificTriggers: 'no',
        })
      })

      it('removes specific triggers not known follow-up if the answer is not "not known"', () => {
        const page = new SelfHarm({ specificTriggers: 'yes', specificTriggersNotKnownDetail: 'Detail' }, application)

        page.onSave()

        expect(page.body).toEqual({
          specificTriggers: 'yes',
        })
      })
    })
  })
})
