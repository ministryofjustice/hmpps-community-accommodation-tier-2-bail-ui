//  Feature: Management Info user views download links
//    So that I can analyse usage of the service
//    As a MI User
//    I want to download reports based on domain events
//
//    Scenario: download management information
//      Given I am logged in as an Management Information user
//      When I visit the management info reports page
//      Then I see the download links
//
//    Scenario: try to access reports without the correct role
//      Given I am logged in as a referrer
//      When I visit the management info reports page
//      Then I see an unauthorised screen

import Page from '../../pages/page'
import ManagementInfoDownloadsPage from '../../pages/reports/managementInfoDownloadsPage'

context('Management information downloads', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  //  Scenario: download management information
  it('provides a list of download links', function test() {
    // Given I am logged in as a Management Information user
    cy.task('stubSignIn', { roles: ['CAS2_MI'] })
    cy.task('stubAuthUser')
    cy.signIn()

    //  When I visit the management info reports page
    ManagementInfoDownloadsPage.visit()
    const page = Page.verifyOnPage(ManagementInfoDownloadsPage)

    //  Then see the download links
    page.shouldShowManagementInfoDownloads()
  })

  //  Scenario: try to access reports without the correct role
  it('redirects to the not authorised page', () => {
    //  Given I am logged in as a referrer
    cy.task('stubSignIn', { roles: ['CAS2_PRISON_BAIL_REFERRER'] })
    cy.task('stubAuthUser')
    cy.signIn()

    //  When I visit the management info reports page
    cy.visit('/reports')

    //  Then I see an unauthorised screen
    cy.get('h1').contains('You are not authorised to view this page.')
  })
})
