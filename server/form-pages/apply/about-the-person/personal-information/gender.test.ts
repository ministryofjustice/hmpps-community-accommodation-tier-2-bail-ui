import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import Gender, { GenderBody } from './gender'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

jest.mock('../../../../utils/personUtils')

describe('Gender', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Sue Smith' }) })

  const body: GenderBody = {
    gender: 'no',
    genderIdentity: 'Non-binary',
  }

  it('sets the body', () => {
    const page = new Gender(body, application)

    expect(page.body).toEqual(body)
  })

  describe('errors', () => {
    it('returns an error if gender is not set', () => {
      const page = new Gender({ gender: null }, application)

      expect(page.errors()).toEqual({
        gender:
          "Select if the gender they identify with is the same as the sex registered at birth or 'Prefer not to say'",
      })
    })
  })

  itShouldHaveNextValue(new Gender(body, application), 'pregnancy-information')
  itShouldHavePreviousValue(new Gender(body, application), '')

  describe('onSave', () => {
    it('removes gender identity data if question is not set to "no"', () => {
      const pageBody: GenderBody = {
        gender: 'preferNotToSay',
        genderIdentity: 'Man',
      }

      const page = new Gender(pageBody, application)

      page.onSave()

      expect(page.body).toEqual({
        gender: 'preferNotToSay',
      })
    })
  })
})
