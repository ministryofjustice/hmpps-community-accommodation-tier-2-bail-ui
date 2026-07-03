import { Cas2Application as Application, type Cas2OASysAssessmentMetadataDto } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { DateFormats } from '../../../../../server/utils/dateUtils'

export default class OasysImportPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Import ${nameOrPlaceholderCopy(application.person)}'s risk to self data from OASys`,
      application,
      'risk-to-self',
      'oasys-import',
    )
  }

  verifyOasysMetadata(meta: Cas2OASysAssessmentMetadataDto) {
    cy.contains(DateFormats.isoDateToUIDate(meta.dateStarted, { format: 'medium' }))
    cy.contains(DateFormats.isoDateToUIDate(meta.dateCompleted, { format: 'medium' }))
  }

  verifyNoOasys() {
    cy.contains(`No OASys record available to import for ${nameOrPlaceholderCopy(this.application.person)}`)
  }
}
