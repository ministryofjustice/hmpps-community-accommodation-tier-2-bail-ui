import { Cas2Application as Application, SubmitCas2Application, UpdateApplication } from '@approved-premises/api'

import { preferredAreasFromAppData, telephoneNumberFromAppData } from './managementInfoFromAppData'

export const getApplicationUpdateData = (application: Application): UpdateApplication => {
  return {
    type: 'CAS2',
    data: application.data,
  }
}

export const getApplicationSubmissionData = (application: Application): SubmitCas2Application => {
  return {
    translatedDocument: application.document,
    applicationId: application.id,
    preferredAreas: preferredAreasFromAppData(application),
    telephoneNumber: telephoneNumberFromAppData(application),
  }
}
