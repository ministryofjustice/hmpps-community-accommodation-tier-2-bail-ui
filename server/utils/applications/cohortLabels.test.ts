import { submittedApplicationFactory } from '../../testutils/factories'
import { applicationTypeLabel } from './cohortLabels'

describe('applicationTypeLabel', () => {
  it('returns the label for the cohort', () => {
    const application = submittedApplicationFactory.build({ applicationOrigin: 'other', cohort: 'isc' })

    expect(applicationTypeLabel(application)).toEqual('Intensive supervision courts (ISC)')
  })

  it('falls back to the application origin when there is no cohort', () => {
    const application = submittedApplicationFactory.build({ applicationOrigin: 'courtBail' })

    expect(applicationTypeLabel(application)).toEqual('Court Bail')
  })
})
