import {
  ApplicationOrigin,
  Cas2CohortDto,
  Cas2Application as Application,
  SubmitCas2Application,
  UpdateCas2Application,
} from '@approved-premises/api'

import {
  preferredAreasFromAppData,
  telephoneNumberFromAppData,
  bailHearingDateFromAppData,
} from './managementInfoFromAppData'

export const getApplicationUpdateData = (application: Application, cohort?: Cas2CohortDto): UpdateCas2Application => {
  return {
    type: 'CAS2V2',
    data: application.data,
    cohort: cohort || application.cohort || getBailCohort(application.applicationOrigin),
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

export const getApplicationSubmissionData = (application: Application): SubmitCas2Application => {
  return {
    translatedDocument: application.document,
    applicationId: application.id,
    applicationOrigin: application.applicationOrigin,
    preferredAreas: preferredAreasFromAppData(application),
    telephoneNumber: telephoneNumberFromAppData(application),
    bailHearingDate: bailHearingDateFromAppData(application),
  }
}
