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
//  Scenario: navigate to the task list if the applicant is male
//    Given the applicant is male
//    When I complete the "gender" page
//    And I continue to the next task / page
//    Then I am taken to the task list page
//
//  Scenario: navigate to the pregnancy information page if the applicant is not male
//    Given the applicant is female
//    When I complete the "gender" page
//    And I continue to the next task / page
//    Then I am taken to the pregnancy information page

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import GenderPage from '../../../../pages/apply/about_the_person/personal_information/genderPage'
import TaskListPage from '../../../../pages/apply/taskListPage'
import PregnancyInformationPage from '../../../../pages/apply/about_the_person/personal_information/pregnancyInformationPage'

context('Visit "gender" page with male applicant', () => {
  const male = personFactory.build({ name: 'Roger Smith', sex: 'Male' })

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
      cy.wrap(application).as('maleApplication')
    })
  })

  beforeEach(function test() {
    // And an application exists
    // -------------------------
    cy.task('stubApplicationGet', { application: this.maleApplication })
    cy.task('stubApplicationUpdate', { application: this.maleApplication })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I visit the 'gender' page
    // --------------------------------
    GenderPage.visit(this.maleApplication)
  })

  //  Scenario: view 'gender' page
  // ----------------------------------------------

  it('presents gender page', function test() {
    //  Then I see the "gender" page
    Page.verifyOnPage(GenderPage, this.maleApplication)
  })

  //  Scenario: navigate to the task list page if the applicant is male
  // ----------------------------------------------
  it('navigates to the task list page', function test() {
    //    Given the applicant is male

    //    When I complete the "gender" page
    const page = Page.verifyOnPage(GenderPage, this.maleApplication)
    page.completeForm()

    //    When I continue to the next task / page
    page.clickSubmit()

    //    Then I am taken to the task list page
    Page.verifyOnPage(TaskListPage, this.maleApplication)
  })
})

context('Visit "gender" page with female applicant', () => {
  const female = personFactory.build({ name: 'Rogella Smith', sex: 'Female' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['personal-information'].gender
      const application = applicationFactory.build({
        id: 'abc123',
        person: female,
        data: applicationData,
      })
      cy.wrap(application).as('femaleApplication')
    })
  })

  beforeEach(function test() {
    // And a female application exists
    // -------------------------
    cy.task('stubApplicationGet', { application: this.femaleApplication })
    cy.task('stubApplicationUpdate', { application: this.femaleApplication })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I visit the 'gender' page
    // --------------------------------
    GenderPage.visit(this.femaleApplication)
  })

  //  Scenario: navigate to the pregnancy information page if the applicant is not male
  // ----------------------------------------------
  it('navigates to the pregnancy information page', function test() {
    //    When I complete the "gender" page
    const page = Page.verifyOnPage(GenderPage, this.femaleApplication)
    page.completeForm()

    //    When I continue to the next task / page
    page.clickSubmit()

    //    Then I am taken to the pregnancy information page
    Page.verifyOnPage(PregnancyInformationPage, this.femaleApplication)
  })
})
