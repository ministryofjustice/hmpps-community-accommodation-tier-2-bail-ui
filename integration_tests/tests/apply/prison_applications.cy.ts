//  Feature: referrer views prison applications
//    So that I can see recently created applications for my prison
//    So that I can manage applications
//
//  Scenario: viewing the prison applications page as a referrer
//      Given I am logged in as a prison bail referrer
//      And there are submitted applications for my prison in the database
//      When I visit the prison applications page
//      Then I can see the prison applications page
//      And I can see a list of applications for my prison

import { applicationSummaryFactory } from '../../../server/testutils/factories'
import PrisonApplicationsPage from '../../pages/apply/prisonApplicationsPage'
import Page from '../../pages/page'

context('Prison applications', () => {
  //  Scenario: viewing the home page as a referrer
  it('displays the prison applications page', () => {
    // Given I am logged in as a prison bail referrer
    const prisonCode = 'ABC'
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_PRISON_BAIL_REFERRER'] })
    cy.task('stubAuthUser', { activeCaseLoadId: prisonCode })

    cy.signIn()

    // And there are submitted applications for my prison in the database
    const prisonApplications = applicationSummaryFactory.buildList(3)
    cy.task('stubApplicationOrigin', { applications: prisonApplications, prisonCode })

    // When I visit the prison applications page
    PrisonApplicationsPage.visit()

    // Then I can see the prison applications page
    Page.verifyOnPage(PrisonApplicationsPage)

    const prisonApplicationsPage = new PrisonApplicationsPage()

    // And I can see a list of applications for my prison
    prisonApplicationsPage.shouldShowPrisonApplications(prisonApplications)
  })
})
