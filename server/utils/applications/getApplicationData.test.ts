import { applicationFactory } from '../../testutils/factories'
import applicationDataJson from '../../../integration_tests/fixtures/applicationData.json'
import { getApplicationSubmissionData, getApplicationUpdateData } from './getApplicationData'

describe('getApplicationUpdateData', () => {
  it('returns the application data for the prison bail cohort', () => {
    const mockApplication = applicationFactory.build({ applicationOrigin: 'prisonBail' })
    expect(getApplicationUpdateData(mockApplication)).toEqual({
      type: 'CAS2V2',
      data: mockApplication.data,
      cohort: 'prisonBail',
    })
  })

  it('returns the application data for the court bail cohort', () => {
    const mockApplication = applicationFactory.build({ applicationOrigin: 'courtBail' })
    expect(getApplicationUpdateData(mockApplication)).toEqual({
      type: 'CAS2V2',
      data: mockApplication.data,
      cohort: 'courtBail',
    })
  })

  it('returns the application data for an unimplemented cohort', () => {
    const mockApplication = applicationFactory.build({ applicationOrigin: 'other' })
    const result = getApplicationUpdateData(mockApplication)
    expect(result).toEqual({
      type: 'CAS2V2',
      data: mockApplication.data,
    })
  })
})

describe('getApplicationSubmissionData', () => {
  it('returns the submission data', () => {
    const mockApplication = applicationFactory.build({ data: applicationDataJson })

    expect(getApplicationSubmissionData(mockApplication)).toEqual({
      applicationId: mockApplication.id,
      applicationOrigin: mockApplication.applicationOrigin,
      translatedDocument: mockApplication.document,
      preferredAreas: 'London | Birmingham',
      telephoneNumber: '1234567',
      bailHearingDate: '3000-02-02',
    })
  })
})
