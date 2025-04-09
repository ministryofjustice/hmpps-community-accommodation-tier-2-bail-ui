/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'unspent convictions' page
//    So that I can complete the "unspent convictions" task
//    As a referrer
//    I want to complete the 'unspent convictions' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "unspent convictions" page
//
//  Scenario: referrer visits task for the first time
//    Then I see the "Unspent convictions data" page
//
//  Scenario: shows error when no unspent convictions are added
//    Given I am on the unspent conviction page
//    And I remove all unspent convictions
//    When I click "Save and continue"
//    Then I am presented with an error
//
//  Scenario: select add a unspent conviction
//    Given I am on the unspent conviction page
//    When I click "Add another unspent conviction type"
//    Then I see the "unspent conviction data" page
//
//  Scenario: complete page and navigate to next page
//    When I continue to the next task / page
//    Then I see the "task list" page

import UnspentConvictionsPage from '../../../../pages/apply/offence-information/previous-unspent-convictions/unspentConvictionsPage'
import UnspentConvictionsDataPage from '../../../../pages/apply/offence-information/previous-unspent-convictions/unspentConvictionsDataPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import TaskListPage from '../../../../pages/apply/taskListPage'

context('Visit "Offence information" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['previous-unspent-convictions']
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })

    cy.fixture('applicationData.json').then(applicationData => {
      const applicationWithData = applicationFactory.build({
        ...this.application,
        data: applicationData,
      })
      cy.wrap(applicationWithData).as('applicationWithData')
    })

    const applicationWithDeletedData = applicationFactory.build({
      id: 'abc123',
      person,
      data: {
        'previous-unspent-convictions': { 'unspent-convictions-data': [] },
      },
    })
    cy.wrap(applicationWithDeletedData).as('applicationWithDeletedData')
  })

  beforeEach(function test() {
    // And an application exists
    // -------------------------
    cy.task('stubApplicationGet', { application: this.applicationWithData })
    cy.task('stubApplicationUpdate', { application: this.applicationWithData })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I am on the unspent convictions page
    // --------------------------------
    UnspentConvictionsPage.visit(this.applicationWithData)
  })

  //  Scenario: referrer visits task for the first time
  //    Then I see the "Unspent convictions data" page
  it('presents unspent convictions data page', function test() {
    // When there is no imported data
    cy.task('stubApplicationGet', { application: this.application })

    UnspentConvictionsPage.visit(this.application)

    Page.verifyOnPage(UnspentConvictionsDataPage, this.application)
  })

  //  Scenario: shows error when no unspent convictions are added
  //    Given I am on the unspent conviction page
  //    And I remove all unspent convictions
  //    When I click "Save and continue"
  //    Then I am presented with an error
  it('displays an error when no unspent convictions are added', function test() {
    const page = new UnspentConvictionsPage(this.applicationWithData)
    page.hasListOfUnspentConvictions()

    // When I remove an offence
    // reset the application to the deleted state
    cy.task('stubApplicationGet', { application: this.applicationWithDeletedData })
    page.clickRemove()

    page.hasNoUnspentConvictions()

    page.clickSubmit()

    page.shouldShowErrorSummary()
  })

  //  Scenario: select add a unspent conviction
  //    Given I am on the unspent conviction page
  //    When I click "Add another unspent conviction type"
  //    Then I see the "unspent conviction data" page
  it('navigates to the unspent convictions data page', function test() {
    const page = new UnspentConvictionsPage(this.applicationWithData)

    page.clickAddAnotherUnspentConviction()

    Page.verifyOnPage(UnspentConvictionsDataPage, this.applicationWithData)
  })

  //  Scenario: complete page and navigate to next page
  //    When I continue to the next task / page
  //    Then I see the "task list" page
  it('navigates to the next page (task list)', function test() {
    const page = new UnspentConvictionsPage(this.applicationWithData)

    page.hasListOfUnspentConvictions()

    page.clickSubmit()

    Page.verifyOnPage(TaskListPage, this.applicationWithData)
  })
})
