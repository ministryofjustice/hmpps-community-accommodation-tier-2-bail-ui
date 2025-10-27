import { FullPerson, Cas2v2Application, Cas2v2SubmittedApplication } from '@approved-premises/api'
import { getApplicationSummaryData } from './getApplicationSummaryData'
import { applicationFactory, submittedApplicationFactory } from '../testutils/factories/index'

describe('getApplicationSummaryData', () => {
  it('returns correct summary for Cas2v2Application', () => {
    const application: Cas2v2Application = applicationFactory.build({
      id: 'app-1',
      person: {
        name: 'Jane Smith',
        nomsNumber: 'B5678CD',
        prisonName: 'HMP Test',
        crn: 'X123456',
      } as FullPerson,
      createdBy: {
        name: 'Referrer User',
        email: 'referrer@test.com',
      },
      telephoneNumber: '07123 456789',
      applicationOrigin: 'prisonBail',
      data: {
        'personal-information': {
          'custody-location': {
            custodyLocation: 'HMP Test',
          },
        },
      },
    })

    const result = getApplicationSummaryData('referrerSubmission', application)
    expect(result).toEqual({
      id: 'app-1',
      name: 'Jane Smith',
      applicationOrigin: 'prisonBail',
      crn: 'X123456',
      prisonNumber: 'B5678CD',
      prisonName: 'HMP Test',
      referrerName: 'Referrer User',
      contactEmail: 'referrer@test.com',
      contactNumber: '07123 456789',
      view: 'referrerSubmission',
    })
  })

  it('returns correct summary for Cas2v2SubmittedApplication', () => {
    const application: Cas2v2SubmittedApplication = submittedApplicationFactory.build({
      id: 'app-2',
      person: {
        name: 'Alex Doe',
        nomsNumber: 'C9876EF',
        prisonName: null,
        crn: 'Y654321',
      } as FullPerson,
      submittedBy: {
        name: 'Assessor User',
        email: 'assessor@test.com',
      },
      telephoneNumber: '07999 888777',
      applicationOrigin: 'prisonBail',
      document: {
        sections: [
          {
            title: 'About the applicant',
            tasks: [
              {
                title: 'Add personal information',
                questionsAndAnswers: [
                  {
                    question: 'Where is Alex Doe being held in custody?',
                    answer: 'HMP Example',
                  },
                ],
              },
            ],
          },
        ],
      },
    })

    const result = getApplicationSummaryData('assessor', application)
    expect(result).toEqual({
      id: 'app-2',
      name: 'Alex Doe',
      applicationOrigin: 'prisonBail',
      crn: 'Y654321',
      prisonNumber: 'C9876EF',
      prisonName: 'HMP Example',
      referrerName: 'Assessor User',
      contactEmail: 'assessor@test.com',
      contactNumber: '07999 888777',
      view: 'assessor',
    })
  })

  it('returns null for prisonName if not present in either type', () => {
    const application: Cas2v2Application = applicationFactory.build({
      id: 'app-3',
      person: {
        name: 'No Prison',
        nomsNumber: 'Z0000ZZ',
        prisonName: null,
        crn: 'Z999999',
      } as FullPerson,
      createdBy: {
        name: 'Referrer User',
        email: 'referrer@test.com',
      },
      telephoneNumber: '0000000000',
      applicationOrigin: 'prisonBail',
      data: {},
    })

    const result = getApplicationSummaryData('referrerSubmission', application)
    expect(result.prisonName).toBeNull()
  })
})
