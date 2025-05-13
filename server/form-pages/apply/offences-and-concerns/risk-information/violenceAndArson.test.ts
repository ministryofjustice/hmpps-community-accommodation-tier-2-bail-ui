import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import ViolenceAndArson from './violenceAndArson'

describe('ViolenceAndArson', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new ViolenceAndArson({}, application)

      expect(page.title).toEqual('Concerns related to violence or arson for Roger Smith')
    })
  })

  itShouldHaveNextValue(new ViolenceAndArson({}, application), 'living-in-the-community')
  itShouldHavePreviousValue(new ViolenceAndArson({}, application), 'does-the-applicant-have-acct-notes')

  describe('errors', () => {
    describe('pastConvictions', () => {
      it('returns an error when an answer is not provided', () => {
        const page = new ViolenceAndArson({ pastConvictions: null }, application)

        expect(page.errors()).toHaveProperty(
          'pastConvictions',
          'Select if they have had any convictions or behaviours related to violence or arson',
        )
      })

      it('returns an error when past convictions contains answer "yes" but the follow-up is not provided', () => {
        const page = new ViolenceAndArson({ pastConvictions: 'yes', pastConvictionsDetail: null }, application)

        expect(page.errors()).toHaveProperty('pastConvictionsDetail', 'Enter details of any incidents')
      })
    })

    describe('currentConcerns', () => {
      it('returns an error when an answer is not provided', () => {
        const page = new ViolenceAndArson({ currentConcerns: null }, application)

        expect(page.errors()).toHaveProperty(
          'currentConcerns',
          'Select if there are any current concerns around violence or arson',
        )
      })

      it('returns an error when current concerns contains answer "yes" but the follow-up is not provided', () => {
        const page = new ViolenceAndArson({ currentConcerns: 'yes', currentConcernsDetail: null }, application)

        expect(page.errors()).toHaveProperty('currentConcernsDetail', 'Enter details of current concerns')
      })
    })
  })

  describe('Removes old data', () => {
    describe('Past convictions', () => {
      it('removes past convictions follow-up if the answer is not "yes"', () => {
        const page = new ViolenceAndArson({ pastConvictions: 'no', pastConvictionsDetail: 'Detail' }, application)

        page.onSave()

        expect(page.body).toEqual({
          pastConvictions: 'no',
        })
      })
    })

    describe('Current concerns', () => {
      it('removes current concerns follow-up if the answer is not "yes"', () => {
        const page = new ViolenceAndArson({ currentConcerns: 'no', currentConcernsDetail: 'Detail' }, application)

        page.onSave()

        expect(page.body).toEqual({
          currentConcerns: 'no',
        })
      })
    })
  })
})
