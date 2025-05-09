import { Cas2v2Application as Application, SubmitCas2v2Application, UpdateApplication } from '@approved-premises/api'

import {
  preferredAreasFromAppData,
  telephoneNumberFromAppData,
  bailHearingDateFromAppData,
} from './managementInfoFromAppData'

export const getApplicationUpdateData = (application: Application): UpdateApplication => {
  return {
    type: 'CAS2V2',
    data: application.data,
  }
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
