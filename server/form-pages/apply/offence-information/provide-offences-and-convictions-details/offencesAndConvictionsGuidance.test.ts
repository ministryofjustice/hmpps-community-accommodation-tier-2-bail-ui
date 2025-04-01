import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import OffencesAndConvictionsGuidance from './offencesAndConvictionsGuidance'

describe('OffencesAndConvictionsGuidance', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new OffencesAndConvictionsGuidance({}, application)

      expect(page.title).toEqual(`Roger Smith's current alleged offences and previous convictions`)
    })
  })

  itShouldHaveNextValue(new OffencesAndConvictionsGuidance({}, application), '')
  itShouldHavePreviousValue(new OffencesAndConvictionsGuidance({}, application), 'taskList')

  describe('errors', () => {
    it('returns an empty object', () => {
      const page = new OffencesAndConvictionsGuidance({}, application)
      expect(page.errors()).toEqual({})
    })
  })

  describe('response', () => {
    it('returns the response', () => {
      const page = new OffencesAndConvictionsGuidance({}, application)
      expect(page.response()).toEqual({
        "Roger Smith's current alleged offences and previous convictions": 'Guidance confirmed',
      })
    })
  })
})
