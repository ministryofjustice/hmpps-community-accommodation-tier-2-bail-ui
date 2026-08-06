import {
  Cas2CohortDto,
  Cas2Application as Application,
  SubmitCas2Application,
  UpdateCas2Application,
} from '@approved-premises/api'

import { bailCohorts } from './cohortLabels'

import {
  preferredAreasFromAppData,
  telephoneNumberFromAppData,
  bailHearingDateFromAppData,
} from './managementInfoFromAppData'

export const getApplicationUpdateData = (application: Application, cohort?: Cas2CohortDto): UpdateCas2Application => {
  return {
    type: 'CAS2V2',
    data: application.data,
    cohort: cohort || application.cohort || bailCohorts[application.applicationOrigin],
  }
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
