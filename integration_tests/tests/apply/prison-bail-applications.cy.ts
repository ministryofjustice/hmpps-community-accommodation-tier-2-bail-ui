//  Feature: referrer views prison applications
//    So that I can see recently created prison bail applications
//    So that I can manage applications
//
//  Scenario: viewing the prison applications page as a referrer
//      Given I am logged in as a prison bail referrer
//      And there are submitted prison bail applications in the database
//      When I visit the prison applications page
//      Then I can see the prison applications page
//      And I can see a list of prison bail applications

import { applicationSummaryFactory } from '../../../server/testutils/factories'
import PrisonApplicationsPage from '../../pages/apply/prisonApplicationsPage'
import Page from '../../pages/page'

context('Prison applications', () => {
  //  Scenario: viewing the home page as a referrer
  it('displays the prison applications page', () => {
    // Given I am logged in as a prison bail referrer
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_PRISON_BAIL_REFERRER'] })
    cy.task('stubAuthUser')

    cy.signIn()

    // And there are submitted prison bail applications in the database
    const prisonApplications = applicationSummaryFactory.buildList(3, { applicationOrigin: 'prisonBail' })
    cy.task('stubApplicationOrigin', { applications: prisonApplications })

    // When I visit the prison applications page
    PrisonApplicationsPage.visit()

    // Then I can see the prison applications page
    Page.verifyOnPage(PrisonApplicationsPage)

    const prisonApplicationsPage = new PrisonApplicationsPage()

    // And I can see a list of prison bail applications
    prisonApplicationsPage.shouldShowApplications(prisonApplications)
  })
})
