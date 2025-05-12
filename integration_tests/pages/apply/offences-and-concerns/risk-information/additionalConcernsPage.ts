import { Cas2v2Application as Application } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import ApplyPage from '../../applyPage'
import { pageIsActiveInNavigation } from '../../../utils'

export default class AdditionalConcernsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Add any additional concerns', application, 'risk-information', 'additional-concerns')

    pageIsActiveInNavigation('Additional concerns')
    this.pageHasGuidance()
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-information',
        page: 'additional-concerns',
      }),
    )
  }

  describeAdditionalConcerns(): void {
    this.checkRadioByNameAndValue('additionalConcerns', 'yes')
    this.getTextInputByIdAndEnterDetails('additionalConcernsDetail', 'Description of additional concerns')
  }

  pageHasGuidance(): void {
    cy.get('[data-testid="additional-concerns-hint"]').should(
      'contain',
      'These include other categories that might impact staff, known adults, children or the applicant, such as:',
    )
    cy.get('[data-testid="additional-concerns-hint"]').should('contain', 'acquisitive offending')
    cy.get('[data-testid="additional-concerns-hint"]').should('contain', 'driving-related offences')
    cy.get('[data-testid="additional-concerns-hint"]').should('contain', 'drug supply and county lines involvement')
    cy.get('[data-testid="additional-concerns-hint"]').should(
      'contain',
      'exploitation (such as unpaid labour, modern slavery, human trafficking or cuckooing)',
    )
    cy.get('[data-testid="additional-concerns-hint"]').should('contain', 'media and public relations')
    cy.get('[data-testid="additional-concerns-hint"]').should('contain', 'sex work')
    cy.get('[data-testid="additional-concerns-hint"]').should('contain', 'stalking and harassment')
    cy.get('[data-testid="additional-concerns-hint"]').should(
      'contain',
      'This is because they are relevant to living in shared accommodation.',
    )
  }
}
