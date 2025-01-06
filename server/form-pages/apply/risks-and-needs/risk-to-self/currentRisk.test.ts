import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CurrentRisk from './currentRisk'

describe('CurrentRisk', () => {
  const person = personFactory.build({ name: 'Roger Smith' })
  const application = applicationFactory.build({ person })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new CurrentRisk({}, application)

      expect(page.title).toEqual("Roger Smith's current risks")
    })
  })

  describe('Questions', () => {
    const page = new CurrentRisk({}, application)

    describe('currentRiskDetail', () => {
      it('has a question', () => {
        expect(page.questions.currentRiskDetail.question).toBeDefined()
      })
    })
  })

  itShouldHaveNextValue(new CurrentRisk({}, application), 'historical-risk')
  itShouldHavePreviousValue(new CurrentRisk({}, application), 'vulnerability')

  describe('errors', () => {
    it('returns an error when currentRiskDetail is blank', () => {
      const page = new CurrentRisk({}, application)
      expect(page.errors()).toEqual({
        currentRiskDetail: "Describe Roger Smith's current issues and needs related to self harm and suicide",
      })
    })
  })
})
