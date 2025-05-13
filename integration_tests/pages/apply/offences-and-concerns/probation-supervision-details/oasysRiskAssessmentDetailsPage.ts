import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'

export default class OASysRiskAssessmentDetailsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      'Provide details of the OASys assessment',
      application,
      'add-probation-supervision-details',
      'oasys-risk-assessment-details',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'add-probation-supervision-details',
        page: 'oasys-risk-assessment-details',
      }),
    )
  }

  completeInTheCommunityRisks() {
    cy.get('[data-testid="inTheCommunityPublic"]').check()
    cy.get('[data-testid="inTheCommunityPublicRisk-low"]').check()

    cy.get('[data-testid="inTheCommunityChildren"]').check()
    cy.get('[data-testid="inTheCommunityChildrenRisk-medium"]').check()
  }

  completeInCustodyRisks() {
    cy.get('[data-testid="inCustodyPublic"]').check()
    cy.get('[data-testid="inCustodyPublicRisk-veryHigh"]').check()
  }

  completeRisksWithoutRiskLevels() {
    cy.get('[data-testid="inTheCommunityPublic"]').check()
    cy.get('[data-testid="inCustodyPublic"]').check()
  }

  shouldShowErrorSummary(): void {
    cy.get('.govuk-error-summary').should('contain', 'Select if they are a risk to anyone in the community')
    cy.get('.govuk-error-summary').should('contain', 'Select if they are a risk to anyone in custody')
  }

  shouldShowErrorSummaryForRiskLevels(): void {
    cy.get('.govuk-error-summary').should('contain', 'Select if the risk is low, medium, high or very high')
  }
}
