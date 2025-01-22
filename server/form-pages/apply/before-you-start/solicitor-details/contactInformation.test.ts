import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import ContactInformation from './contactInformation'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('ContactInformation', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHaveNextValue(new ContactInformation({}, application), '')
  itShouldHavePreviousValue(new ContactInformation({}, application), 'has-solicitor')

  describe('errors', () => {
    it('returns an error if fields are are missing', () => {
      const page = new ContactInformation({}, application)

      expect(page.errors()).toEqual({
        number: "Enter the solicitor's contact number",
        legalFirmAndAddress: "Enter the solicitor's legal firm and address",
        email: "Enter the solicitor's email address",
        name: "Enter the solicitor's full name",
      })
    })
  })

  describe('response', () => {
    it('returns the correct response', () => {
      const applicationWithData = {
        ...application,
        data: {
          'solicitor-details': {
            'contact-information': {
              name: 'Solicitor',
              legalFirmAndAddress: 'Legal Firm, 8 road, 1UV 7KK',
              email: 'solicitor@legalfirm.com',
              number: '111111111111',
            },
          },
        },
      }

      const page = new ContactInformation({}, applicationWithData)

      expect(page.response()).toEqual({
        'Solicitor contact information': `Name: Solicitor\r\nLegal firm address: Legal Firm, 8 road, 1UV 7KK\r\nEmail: solicitor@legalfirm.com\r\nPhone number: 111111111111\r\n`,
      })
    })
  })
})
