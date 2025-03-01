import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { applicationFactory } from '../../../../testutils/factories/index'
import ApplicantID from './applicantID'

describe('Identification', () => {
  const application = applicationFactory.build({})

  itShouldHaveNextValue(new ApplicantID({ idDocuments: ['none'] }, application), 'alternative-applicant-id')
  itShouldHaveNextValue(new ApplicantID({ idDocuments: ['travelPass'] }, application), '')

  itShouldHavePreviousValue(new ApplicantID({}, application), 'funding-cas2-accommodation')

  describe('errors', () => {
    it('returns error if no document is selected', () => {
      const page = new ApplicantID({}, application)

      expect(page.errors()).toEqual({ idDocuments: "Select an ID document or 'None of these options'" })
    })
  })

  describe('items', () => {
    it('returns items as expected', () => {
      const page = new ApplicantID({}, application)

      const expected = [
        {
          attributes: {
            'data-selector': 'documents',
          },
          checked: false,
          text: 'Passport',
          value: 'passport',
        },
        {
          attributes: {
            'data-selector': 'documents',
          },
          checked: false,
          text: 'Travel pass with photograph',
          value: 'travelPass',
        },
        {
          attributes: {
            'data-selector': 'documents',
          },
          checked: false,
          text: 'Birth certificate',
          value: 'birthCertificate',
        },
        {
          attributes: {
            'data-selector': 'documents',
          },
          checked: false,
          text: 'Bank account or debit card',
          value: 'bankOrDebitCard',
        },
        {
          attributes: {
            'data-selector': 'documents',
          },
          checked: false,
          text: 'Bank, building society or Post Office card account statements',
          value: 'bankStatements',
        },
        {
          attributes: {
            'data-selector': 'documents',
          },
          checked: false,
          text: 'UK photo driving licence (full or provisional)',
          value: 'drivingLicence',
        },
        {
          attributes: {
            'data-selector': 'documents',
          },
          checked: false,
          text: 'Recent wage slip (with payee name and NI number)',
          value: 'wageSlip',
        },
        {
          divider: 'or',
        },
        {
          checked: false,
          text: 'None of these options',
          value: 'none',
        },
      ]
      expect(page.items()).toEqual(expected)
    })
  })
})
