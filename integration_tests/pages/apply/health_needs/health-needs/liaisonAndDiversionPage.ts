import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class LiaisonAndDiversionPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Has a Liaison and Diversion Assessment been carried out for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'liaison-and-diversion',
    )
    pageIsActiveInNavigation('Liaison and diversion assessment')
  }

  static visit(application: Application): LiaisonAndDiversionPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'liaison-and-diversion',
      }),
    )

    return new LiaisonAndDiversionPage(application)
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('liaisonAndDiversionAssessment', 'yes')
  }
}
