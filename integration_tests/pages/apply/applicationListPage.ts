import { Cas2v2Application as Application, Cas2v2ApplicationSummary } from '@approved-premises/api'
import Page from '../page'
import paths from '../../../server/paths/apply'

export default class ApplicationListPage extends Page {
  constructor(
    private readonly applications: Array<Cas2v2ApplicationSummary>,
    name: string,
  ) {
    super('Your CAS2 applications', name)
  }

  static visit(applications: Array<Cas2v2ApplicationSummary>): ApplicationListPage {
    cy.visit(paths.applications.index.pattern)

    return new ApplicationListPage(applications, applications[0]?.personName)
  }

  shouldShowInProgressApplications(): void {
    this.shouldShowApplications(this.applications, true)
  }

  shouldShowSubmittedApplications(): void {
    cy.get('a').contains('Submitted').click()
    this.shouldShowApplications(this.applications)
  }

  shouldShowPrisonTab(): void {
    cy.contains(`All prison bail applications`).should('have.attr', 'href', paths.applications.prison.pattern)
  }

  shouldNotShowPrisonTab(): void {
    cy.contains(`All prison bail applications`).should('not.exist')
  }

  clickApplication(application: Application) {
    cy.get(`a[data-cy-id="${application.id}"]`).click()
  }

  clickCancel = (): void => {
    cy.get('a').contains('Cancel').click()
  }
}
