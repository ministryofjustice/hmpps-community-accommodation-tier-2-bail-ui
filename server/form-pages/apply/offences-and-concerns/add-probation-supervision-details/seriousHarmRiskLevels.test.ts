import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import SeriousHarmRiskLevels from './seriousHarmRiskLevels'

describe('SeriousHarmRiskLevels', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('sets the page title', () => {
      const page = new SeriousHarmRiskLevels({}, application)

      expect(page.title).toEqual('Confirm the current risk levels as discussed with the CPP')
    })
  })

  itShouldHavePreviousValue(new SeriousHarmRiskLevels({}, application), 'contacted-cpp-about-current-risk-levels')
  itShouldHaveNextValue(new SeriousHarmRiskLevels({}, application), '')

  describe('items', () => {
    it('returns a list of radio items for the input field name', () => {
      const page = new SeriousHarmRiskLevels(
        {
          overallRiskLevel: 'high',
          riskToChildren: 'medium',
          riskToKnownAdults: 'high',
          riskToPublic: 'veryHigh',
          riskToStaff: 'low',
        },
        application,
      )

      expect(page.items('overallRiskLevel')).toEqual([
        { checked: false, text: 'Very high risk', value: 'veryHigh' },
        { checked: true, text: 'High risk', value: 'high' },
        { checked: false, text: 'Medium risk', value: 'medium' },
        { checked: false, text: 'Low risk', value: 'low' },
      ])
      expect(page.items('riskToChildren')).toEqual([
        { checked: false, text: 'Very high risk', value: 'veryHigh' },
        { checked: false, text: 'High risk', value: 'high' },
        { checked: true, text: 'Medium risk', value: 'medium' },
        { checked: false, text: 'Low risk', value: 'low' },
      ])
      expect(page.items('riskToKnownAdults')).toEqual([
        { checked: false, text: 'Very high risk', value: 'veryHigh' },
        { checked: true, text: 'High risk', value: 'high' },
        { checked: false, text: 'Medium risk', value: 'medium' },
        { checked: false, text: 'Low risk', value: 'low' },
      ])
      expect(page.items('riskToPublic')).toEqual([
        { checked: true, text: 'Very high risk', value: 'veryHigh' },
        { checked: false, text: 'High risk', value: 'high' },
        { checked: false, text: 'Medium risk', value: 'medium' },
        { checked: false, text: 'Low risk', value: 'low' },
      ])
      expect(page.items('riskToStaff')).toEqual([
        { checked: false, text: 'Very high risk', value: 'veryHigh' },
        { checked: false, text: 'High risk', value: 'high' },
        { checked: false, text: 'Medium risk', value: 'medium' },
        { checked: true, text: 'Low risk', value: 'low' },
      ])
    })
  })

  describe('errors', () => {
    const requiredFields = [
      ['overallRiskLevel', 'Select their overall risk level'],
      ['riskToChildren', 'Select their level of risk to children'],
      ['riskToKnownAdults', 'Select their level of risk to known adults'],
      ['riskToPublic', 'Select their level of risk to the public'],
      ['riskToStaff', 'Select their level of risk to staff'],
    ]

    it.each(requiredFields)(
      'it includes a validation error for %s, when an answer is not selected',
      (field, message) => {
        const page = new SeriousHarmRiskLevels({}, application)
        const errors = page.errors()

        expect(errors[field as keyof typeof errors]).toEqual(message)
      },
    )
  })
})
