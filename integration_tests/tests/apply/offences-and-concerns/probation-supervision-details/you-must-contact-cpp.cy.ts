/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'you must contact cpp' page
//    So that I can complete the "add probation supervision" task
//    As a referrer
//    I want to complete the 'you must contact cpp' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "you must contact cpp" page
//
//  Scenario: navigate to change your answer regarding contacting the CPP
//    Given I am on the you must contact cpp page
//    And I click the "Change your answer about contacting the CPP" link
//    Then I see the "contacted CPP about current risk levels" page

import YouMustContactTheCppPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/youMustContactTheCppPage'
import ContactedCppAboutCurrentRiskLevelsPage from '../../../../pages/apply/offences-and-concerns/probation-supervision-details/contactedCppAboutCurrentRiskLevelsPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Offences and concerns" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['add-probation-supervision-details']['serious-harm-risk-levels']
      const application = applicationFactory.build({
        id: 'abc123',
        person,
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

    // And I am on the you must contact cpp page
    // --------------------------------
    YouMustContactTheCppPage.visit(this.application)
  })

  //  Scenario: navigate to change your answer regarding contacting the CPP
  //    Given I am on the you must contact cpp page
  //    And I click the "Change your answer about contacting the CPP" link
  //    Then I see the "contacted CPP about current risk levels" page
  it('navigates to the next page (contacted CPP about current risk levels)', function test() {
    const page = new YouMustContactTheCppPage(this.application)

    page.clickChangeYourAnswer()

    Page.verifyOnPage(ContactedCppAboutCurrentRiskLevelsPage, this.application)
  })
})
