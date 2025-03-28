import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import AllegedOffencesSummary from './allegedOffencesSummary'

describe('AllegedOffencesSummarySummary', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new AllegedOffencesSummary({}, application)

      expect(page.title).toEqual('Alleged offences summary for Roger Smith')
    })
  })

  itShouldHaveNextValue(new AllegedOffencesSummary({}, application), '')
  itShouldHavePreviousValue(new AllegedOffencesSummary({}, application), 'alleged-offences')

  describe('errors', () => {
    it('returns an error where there is no alleged offence summary', () => {
      const page = new AllegedOffencesSummary({}, application)
      expect(page.errors()).toEqual({ summary: 'Enter a summary of the alleged offences' })
    })
  })
})
