//  Feature: referrer view static interview question sheet
//    So that I can collect information from an applicant when the digital service is unavailable
//    As a referrer
//    I want to view a static page with interview questions
//
//  Scenario: viewing the interview questions
//      Given I am logged in as a referrer
//      When I visit the interview questions page
//      Then I see the questions

import InterviewQuestionsPage from '../pages/interviewQuestionsPage'
import Page from '../pages/page'

context('Interview questions', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  //  Scenario: viewing the interview questions
  it('shows the questions', () => {
    // Given I am logged in as a referrer
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_COURT_BAIL_REFERRER'] })
    cy.task('stubAuthUser')
    cy.signIn()

    //  When I visit the interview questions page
    InterviewQuestionsPage.visit()
    const page = Page.verifyOnPage(InterviewQuestionsPage)

    //  Then I see the questions
    page.shouldShowSections()
  })
})
