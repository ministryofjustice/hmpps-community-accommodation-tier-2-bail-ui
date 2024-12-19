import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import BailHearingContact from './bailHearingContact'

describe('BailHearingContact', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHavePreviousValue(new BailHearingContact({}, application), 'bail-hearing-arranger')
  itShouldHaveNextValue(new BailHearingContact({}, application), 'consult-legal-advisor')

  describe('response', () => {
    describe('when all contact information is present', () => {
      it('returns the contact details formatted correctly', () => {
        const applicationWithData = {
          ...application,
          data: {
            'bail-hearing-arrangement': {
              'bail-hearing-contact': {
                name: 'Legal Advisor',
                legalFirmAndAddress: 'Legal Firm, 8 road, 1UV 7KK',
                email: 'advisor@legalfirm.com',
                number: '111111111111',
              },
            },
          },
        }

        const page = new BailHearingContact({}, applicationWithData)

        expect(page.response()).toEqual({
          'Legal advisor contact information': `Name: Legal Advisor\r\nLegal firm address: Legal Firm, 8 road, 1UV 7KK\r\nEmail: advisor@legalfirm.com\r\nPhone number: 111111111111\r\n`,
        })
      })
    })

    describe('when not all contact information is present', () => {
      it('returns the contact details formatted correctly', () => {
        const applicationWithData = {
          ...application,
          data: {
            'bail-hearing-arrangement': {
              'bail-hearing-contact': {
                name: 'Legal Advisor',
                email: 'advisor@legalfirm.com',
              },
            },
          },
        }

        const page = new BailHearingContact({}, applicationWithData)

        expect(page.response()).toEqual({
          'Legal advisor contact information': `Name: Legal Advisor\r\nEmail: advisor@legalfirm.com\r\n`,
        })
      })
    })
  })
})
