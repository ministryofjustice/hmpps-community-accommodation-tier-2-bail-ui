/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'custody location' page
//    So that I can complete the "personal information" task
//    As a referrer
//    I want to complete the 'custody location' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I visit the 'custody location' page
//
//  Scenario: view 'custody location' page
//    Then I see the "custody location" page
//
//  Scenario: navigate to the next page on completion of task
//    When I complete the "custody location" page
//    And I continue to the next task / page
//    Then I am taken to the working mobile phone page

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import CustodyLocationPage from '../../../../pages/apply/about_the_person/personal_information/custodyLocationPage'
import WorkingMobilePhonePage from '../../../../pages/apply/about_the_person/personal_information/workingMobilePhonePage'

context('Visit "custody location" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['personal-information']['custody-location']
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

    // And I visit the 'custody location' page
    // --------------------------------
    CustodyLocationPage.visit(this.application)
  })

  //  Scenario: view 'custody location' page
  // ----------------------------------------------

  it('presents custody location page', function test() {
    //    Then I see the "custody location" page
    Page.verifyOnPage(CustodyLocationPage, this.application)
  })

  //  Scenario: navigate to the next page
  // ----------------------------------------------
  it('navigates to the next page', function test() {
    //    When I complete the "custody location" page
    const page = Page.verifyOnPage(CustodyLocationPage, this.application)
    page.completeForm()

    //    When I continue to the next task / page
    page.clickSubmit()

    //    Then I am taken to the working mobile phone page
    Page.verifyOnPage(WorkingMobilePhonePage, this.application)
  })
})
