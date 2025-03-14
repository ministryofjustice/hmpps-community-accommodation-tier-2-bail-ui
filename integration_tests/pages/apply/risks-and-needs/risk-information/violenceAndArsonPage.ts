import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../risks_and_needs/utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class ViolenceAndArsonPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Concerns related to violence or arson for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risk-information',
      'violence-and-arson',
    )

    pageIsActiveInNavigation('Violence and arson')
    this.pageHasGuidance()
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-information',
        page: 'violence-and-arson',
      }),
    )
  }

  describePastConvictions(): void {
    this.checkRadioByNameAndValue('pastConvictions', 'yes')
    this.getTextInputByIdAndEnterDetails('pastConvictionsDetail', 'Has related past convictions')
  }

  describeCurrentConcerns(): void {
    this.checkRadioByNameAndValue('currentConcerns', 'yes')
    this.getTextInputByIdAndEnterDetails('currentConcernsDetail', 'Description of current concerns')
  }

  pageHasGuidance(): void {
    cy.get('[data-testid="violence-and-arson-hint"]').should('contain', 'This can include:')
    cy.get('[data-testid="violence-and-arson-hint"]').should('contain', 'arson with or without intent')
    cy.get('[data-testid="violence-and-arson-hint"]').should('contain', 'assault')
    cy.get('[data-testid="violence-and-arson-hint"]').should('contain', 'criminal damage')
    cy.get('[data-testid="violence-and-arson-hint"]').should('contain', 'domestic violence (perpetrator)')
    cy.get('[data-testid="violence-and-arson-hint"]').should('contain', 'sexual violence')
    cy.get('[data-testid="violence-and-arson-hint"]').should('contain', 'weapons')
    cy.get('[data-testid="violence-and-arson-hint"]').should('contain', 'This list is not exhaustive')
  }
}
