import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class ManualRoshInformationPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Create a RoSH summary for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risks-of-serious-harm-to-others',
      'manual-rosh-information',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risks-of-serious-harm-to-others',
        page: 'manual-rosh-information',
      }),
    )
  }

  checkErrors(): void {
    this.shouldShowErrorSummary('Select the risk they pose to children')
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('riskToChildren', 'Low')
    this.checkRadioByNameAndValue('riskToPublic', 'Medium')
    this.checkRadioByNameAndValue('riskToKnownAdult', 'High')
    this.checkRadioByNameAndValue('riskToStaff', 'Low')
    this.checkRadioByNameAndValue('overallRisk', 'High')
  }
}
