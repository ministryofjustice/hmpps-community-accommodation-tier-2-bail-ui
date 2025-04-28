import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import OtherAreaPreferences from './otherAreaPreferences'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

describe('OtherAreaPreferences', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Sue Smith' }) })
  const body = {
    preferenceInformation: 'London',
  }

  it('sets the question as the page title', () => {
    const page = new OtherAreaPreferences(body, application)

    expect(page.title).toEqual('Other area preferences for Sue Smith')
  })

  it('sets the body', () => {
    const page = new OtherAreaPreferences(body, application)

    expect(page.body).toEqual(body)
  })

  describe('errors', () => {
    it('returns an error if _preferenceInformation_ is blank', () => {
      const page = new OtherAreaPreferences({ preferenceInformation: '' }, application)

      expect(page.errors()).toEqual({
        preferenceInformation: 'Enter other preferences information',
      })
    })
  })

  itShouldHaveNextValue(new OtherAreaPreferences(body, application), 'exclusion-zones')
  itShouldHavePreviousValue(new OtherAreaPreferences(body, application), 'second-preferred-area')
})
