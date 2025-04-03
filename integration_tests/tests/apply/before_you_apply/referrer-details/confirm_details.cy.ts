/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Referrer details' task
//    So that I can complete the 'Referrer details' task
//    As a referrer
//    I want to answer questions on the 'Confirm details' page
//
//  Background:
//    Given I am logged in
//    And I'm on the 'Confirm details' page
//
//  Scenario: view 'Confirm details' page
//    Then I see the "Confirm details" page
//
//  Scenario: Continue to next page
//    When I click 'Save and continue'
//    Then I see the 'Job title' page

import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import ConfirmDetailsPage from '../../../../pages/apply/before_you_apply/referrer_details/confirmDetailsPage'
import JobTitlePage from '../../../../pages/apply/before_you_apply/referrer_details/jobTitlePage'

context('Complete "Confirm details" page in "Referrer details" task', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['referrer-details'] = {}
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })
  })

  beforeEach(function test() {
    //  Background:
    //  Given I am logged in
    cy.signIn()
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    //  And I'm on the 'Confirm details' page
    ConfirmDetailsPage.visit(this.application)
  })

  //  Scenario: view 'Confirm details' page
  it('displays page', function test() {
    // Then I see the "Confirm details" page
    Page.verifyOnPage(ConfirmDetailsPage, this.application)
  })

  //  Scenario: Continue to next page
  //  When I click 'Save and continue'
  //  Then I see the 'Job title' page
  it('continues to next page', function test() {
    const page = Page.verifyOnPage(ConfirmDetailsPage, this.application)

    //  When I click 'Save and continue'
    page.clickSubmit()

    // Then I see the 'Job title' page
    Page.verifyOnPage(JobTitlePage, this.application)
  })
})
