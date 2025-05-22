import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class DomesticAbuseConcernsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Concerns related to domestic abuse for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risk-information',
      'domestic-abuse-concerns',
    )

    pageIsActiveInNavigation('Domestic abuse')
  }

  static visit(application: Application): DomesticAbuseConcernsPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-information',
        page: 'domestic-abuse-concerns',
      }),
    )

    return new DomesticAbuseConcernsPage(application)
  }

  confirmDomesticAbuseConcerns(): void {
    this.checkRadioByNameAndValue('areConcerns', 'yes')
  }

  confirmNoDomesticAbuseConcerns(): void {
    this.checkRadioByNameAndValue('areConcerns', 'no')
  }

  hasGuidance(): void {
    cy.get('[data-testid="domestic-abuse-concerns-guidance"]').should('be.visible')
    cy.get('[data-testid="victim-of-domestic-abuse-guidance"]').should('be.visible')
  }
}
