import { applicationFactory } from '../../testutils/factories'
import applicationDataJson from '../../../integration_tests/fixtures/applicationData.json'
import { getApplicationSubmissionData, getApplicationUpdateData } from './getApplicationData'

describe('getApplicationUpdateData', () => {
  it('returns the application data', () => {
    const mockApplication = applicationFactory.build()
    expect(getApplicationUpdateData(mockApplication)).toEqual({
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
