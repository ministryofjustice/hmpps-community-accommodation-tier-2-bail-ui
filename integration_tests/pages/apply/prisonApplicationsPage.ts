import { Cas2ApplicationSummary } from '@approved-premises/api'
import paths from '../../../server/paths/apply'
import { cohortLabel } from '../../../server/utils/applicationUtils'
import Page from '../page'

export default class PrisonApplicationsPage extends Page {
  constructor() {
    const name = undefined
    super('All CAS2 prison bail applications', name)
  }

  static visit(): PrisonApplicationsPage {
    cy.visit(paths.applications.prison({}))

    return new PrisonApplicationsPage()
  }

  shouldShowApplications(applications: Array<Cas2ApplicationSummary>): void {
    applications.forEach(application => {
      const { personName } = application
      cy.contains('tr', personName).within(() => {
        cy.get('a').should('have.attr', 'href', paths.applications.overview({ id: application.id }))
        cy.get('th').eq(0).contains(personName)
        cy.get('td').eq(0).contains(application.nomsNumber)
        cy.get('td').eq(2).contains(application.crn)
        cy.get('td').eq(4).contains(cohortLabel(application.cohort))
        cy.get('td').eq(5).contains(application.latestStatusUpdate.label)
      })
    })
  }
}
