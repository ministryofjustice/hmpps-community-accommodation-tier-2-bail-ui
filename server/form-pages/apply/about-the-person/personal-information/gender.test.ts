import { itShouldHavePreviousValue } from '../../../shared-examples'
import Gender, { GenderBody } from './gender'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import { isPersonMale } from '../../../../utils/personUtils'

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
        gender: `Choose either Yes, No or Prefer not to say`,
      })
    })
  })

  describe('next', () => {
    beforeEach(() => {
      ;(isPersonMale as jest.Mock).mockReset()
    })

    describe('when the applicant is male', () => {
      it('should not return a page name', () => {
        ;(isPersonMale as jest.Mock).mockImplementation(() => true)

        const page = new Gender(body, application)

        expect(page.next()).toEqual('')
      })
    })

    describe('when the applicant is not male', () => {
      it('should return pregnancy information page name', () => {
        ;(isPersonMale as jest.Mock).mockImplementation(() => false)

        const page = new Gender(body, application)

        expect(page.next()).toEqual('pregnancy-information')
      })
    })
  })

  itShouldHavePreviousValue(new Gender(body, application), 'support-worker-preference')

  describe('onSave', () => {
    it('removes gender identity data if question is not set to "yes"', () => {
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
