/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'gender' page
//    So that I can complete the "personal information" task
//    As a referrer
//    I want to complete the 'gender' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I visit the 'gender' page
//
//  Scenario: view 'gender' page
//    Then I see the "gender" page
//
//  Scenario: navigate to the next page (pregnancy information)
//    When I complete the "gender" page
//    And I continue to the next task / page
//    Then I am taken to the pregnancy information page

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import GenderPage from '../../../../pages/apply/about_the_person/personal_information/genderPage'
import PregnancyInformationPage from '../../../../pages/apply/about_the_person/personal_information/pregnancyInformationPage'

context('Visit "gender" page', () => {
  const male = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['personal-information'].gender
      const application = applicationFactory.build({
        id: 'abc123',
        person: male,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })
  })

  beforeEach(function test() {
    // And an application exists
    // -------------------------
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I visit the 'gender' page
    // --------------------------------
    GenderPage.visit(this.application)
  })

  //  Scenario: view 'gender' page
  // ----------------------------------------------

  it('presents gender page', function test() {
    //  Then I see the "gender" page
    Page.verifyOnPage(GenderPage, this.application)
  })

  //  Scenario: navigate to the task list page if the applicant is male
  // ----------------------------------------------
  it('navigates to the next page (pregnancy information)', function test() {
    //    When I complete the "gender" page
    const page = Page.verifyOnPage(GenderPage, this.application)
    page.completeForm()

    //    When I continue to the next task / page
    page.clickSubmit()

    //    Then I am taken to the pregnancy information page
    Page.verifyOnPage(PregnancyInformationPage, this.application)
  })
})
