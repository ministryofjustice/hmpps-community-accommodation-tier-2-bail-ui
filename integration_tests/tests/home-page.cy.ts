//  Feature: user views home page
//    So that I can navigate to the parts of the service that I need
//    As a user
//    I want to view the correct cards on the home page
//
//  Scenario: viewing the home page as a referrer
//      Given I am logged in as a referrer
//      When I visit the home page
//      Then see the correct cards
//      And I see the links to the interview question sheets
//      And I see the sign out button
//
//  Scenario: viewing the home page as an admin
//      Given I am logged in as an admin
//      When I visit the home page
//      Then I see the correct cards
//      And I do not see the links to the interview question sheets
//
//  Scenario: viewing the home page as an assessor
//      Given I am logged in as an assessor
//      When I visit the home page
//      Then I see no cards
//      And I do not see the links to the interview question sheets
//
//  Scenario: viewing the home page as an Management Info user
//      Given I am logged in as an MI user
//      When I visit the home page
//      Then I see the management info report downloads card
//      And I do not see the links to the interview question sheets

import HomePage from '../pages/homePage'
import Page from '../pages/page'

context('Home', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  //  Scenario: viewing the home page as a referrer
  it('shows the referrer cards', () => {
    // Given I am logged in as a referrer
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_COURT_BAIL_REFERRER'] })
    cy.task('stubAuthUser')
    cy.signIn()

    //  When I visit the home page
    HomePage.visit()
    const page = Page.verifyOnPage(HomePage)

    //  Then see the correct cards
    page.shouldShowCards(['applications', 'new-application'])

    //  And I see the links to the interview question sheets
    page.shouldShowInterviewQuestionLinks()

    //  And I see the sign out button
    page.shouldShowSignOutButton()
  })

  //  Scenario: viewing the home page as an admin
  it('shows the admin cards', () => {
    // Given I am logged in as an admin
    cy.task('stubSignIn', { roles: ['CAS2_ADMIN'] })
    cy.task('stubAuthUser')
    cy.signIn()

    //  When I visit the home page
    HomePage.visit()
    const page = Page.verifyOnPage(HomePage)

    //  Then I see the correct cards
    page.shouldShowCards(['submitted-applications'])

    //  And I do not see the links to the interview question sheets
    page.shouldNotShowInterviewQuestionLinks()
  })

  //  Scenario: viewing the home page as an assessor
  it('shows the assessor cards', () => {
    // Given I am logged in as an assessor
    cy.task('stubSignIn', { roles: ['CAS2_ASSESSOR'] })
    cy.task('stubAuthUser')
    cy.signIn()

    //  When I visit the home page
    HomePage.visit()
    const page = Page.verifyOnPage(HomePage)

    //  Then I see no cards
    page.shouldNotShowCards(['applications', 'new-application'])

    //  And I do not see the links to the interview question sheets
    page.shouldNotShowInterviewQuestionLinks()
  })

  //  Scenario: viewing the home page as an Management Info user
  it('Management info user sees reports download tile', () => {
    // Given I am logged in as an MI user
    cy.task('stubSignIn', { roles: ['CAS2_MI'] })
    cy.task('stubAuthUser')
    cy.signIn()

    // When I visit the home page
    HomePage.visit()
    const page = Page.verifyOnPage(HomePage)

    // Then I see the management info report downloads card
    page.shouldShowCards(['management-information-reports'])

    //  And I do not see the links to the interview question sheets
    page.shouldNotShowInterviewQuestionLinks()
  })
})
