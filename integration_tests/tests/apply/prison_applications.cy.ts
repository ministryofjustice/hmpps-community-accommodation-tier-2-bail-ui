//  Feature: referrer views prison applications
//    So that I can see recently created applications for my prison
//    So that I can manage applications
//
//  Scenario: viewing the prison applications page as a referrer
//      Given I am logged in as a prison bail referrer
//      When I visit the prison applications page
//      Then I can see the prison applications page

import PrisonApplicationsPage from '../../pages/apply/prisonApplicationsPage'
import Page from '../../pages/page'

context('Prison applications', () => {
  //  Scenario: viewing the home page as a referrer
  it('displays the prison applications page', () => {
    // Given I am logged in as a prison bail referrer
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_PRISON_BAIL_REFERRER'] })
    cy.task('stubAuthUser')
    cy.signIn()

    //  When I visit the home page
    PrisonApplicationsPage.visit()

    //  Then I can see the prison applications page
    Page.verifyOnPage(PrisonApplicationsPage)
  })
})
