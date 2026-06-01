import {
  ApplicationOrigin,
  Cas2CohortDto,
  Cas2v2Application as Application,
  SubmitCas2v2Application,
  UpdateCas2v2Application,
} from '@approved-premises/api'

import {
  preferredAreasFromAppData,
  telephoneNumberFromAppData,
  bailHearingDateFromAppData,
} from './managementInfoFromAppData'

export const getApplicationUpdateData = (application: Application): UpdateCas2v2Application => {
  return {
    type: 'CAS2V2',
    data: application.data,
    // TODO: refactor once we're choosing the cohort as part of the application flow
    cohort: application.cohort ?? getBailCohort(application.applicationOrigin),
  }
}

function getBailCohort(applicationOrigin: ApplicationOrigin): Cas2CohortDto | undefined {
  if (applicationOrigin === 'courtBail') {
    return 'courtBail'
  }

  if (applicationOrigin === 'prisonBail') {
    return 'prisonBail'
  }

  return undefined
}

export const getApplicationSubmissionData = (application: Application): SubmitCas2v2Application => {
  return {
    translatedDocument: application.document,
    applicationId: application.id,
    applicationOrigin: application.applicationOrigin,
    preferredAreas: preferredAreasFromAppData(application),
    telephoneNumber: telephoneNumberFromAppData(application),
    bailHearingDate: bailHearingDateFromAppData(application),
  }
}
