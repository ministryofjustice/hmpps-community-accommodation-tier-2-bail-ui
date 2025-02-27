import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class HealthNeedsInformationPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Request health information for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'health-needs-information',
    )
  }

  static visit(application: Application): HealthNeedsInformationPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'health-needs-information',
      }),
    )

    return new HealthNeedsInformationPage(application)
  }
}
