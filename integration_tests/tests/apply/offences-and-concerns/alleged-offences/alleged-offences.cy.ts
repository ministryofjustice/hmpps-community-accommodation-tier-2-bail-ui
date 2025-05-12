/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Alleged offences' page
//    So that I can complete the "Add alleged offences" task
//    As a referrer
//    I want to complete the 'Alleged offences' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "Alleged offences" page
//
//  Scenario: there are existing offences in the application
//    Then I see a list of the existing offences on the "Alleged offences" page
//
//  Scenario: remove an offence, answer is enforced
//    When I remove an offence
//    Then the offence is no longer in the list of offences
//    And when I click continue
//    Then I see an error
//
//  Scenario: referrer visits task for the first time
//    Then I see the "Alleged offence data" page
//
//  Scenario: complete page and navigate to alleged offences summary page
//    When I continue to the next task / page
//    Then I see the "alleged offences summary" page

import AllegedOffencesPage from '../../../../pages/apply/offences-and-concerns/alleged-offences/allegedOffencesPage'
import AllegedOffenceDataPage from '../../../../pages/apply/offences-and-concerns/alleged-offences/allegedOffenceDataPage'
import AllegedOffencesSummaryPage from '../../../../pages/apply/offences-and-concerns/alleged-offences/allegedOffencesSummaryPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'

context('Visit "Offence information" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['alleged-offences']
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })

    cy.fixture('applicationData.json').then(applicationData => {
      const applicationWithData = {
        ...this.application,
        data: applicationData,
      }
      cy.wrap(applicationWithData).as('applicationWithData')
    })

    const applicationWithDeletedData = applicationFactory.build({
      id: 'abc123',
      person,
      data: {
        'alleged-offences': { 'alleged-offence-data': [] },
      },
    })
    cy.wrap(applicationWithDeletedData).as('applicationWithDeletedData')
  })

  beforeEach(function test() {
    // And an application exists
    // -------------------------
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I am on the Alleged offences page
    // --------------------------------
    AllegedOffencesPage.visit(this.application)
  })

  //  Scenario: referrer visits task for the first time
  //    Then I see the "Alleged offence data" page
  it('presents Alleged offence data page', function test() {
    Page.verifyOnPage(AllegedOffenceDataPage, this.application)
  })

  //  Scenario: there are existing offences in the application
  it('presents Alleged offences page with existing offences', function test() {
    // When there is already imported data
    cy.task('stubApplicationGet', { application: this.applicationWithData })
    AllegedOffencesPage.visit(this.applicationWithData)

    // Then I see a list of existing offences on the "Alleged offences" page
    const page = Page.verifyOnPage(AllegedOffencesPage, this.applicationWithData)
    page.hasListOfOffences()
  })

  //  Scenario: remove an offence, answer is enforced
  it('removes an offence and renders error', function test() {
    // When there is already imported data
    cy.task('stubApplicationGet', { application: this.applicationWithData })

    AllegedOffencesPage.visit(this.applicationWithData)

    const page = new AllegedOffencesPage(this.applicationWithData)
    page.hasListOfOffences()

    // When I remove an offence
    // reset the application to the deleted state
    cy.task('stubApplicationGet', { application: this.applicationWithDeletedData })
    page.clickRemove()

    //  Then the offence is no longer in the list of offences
    page.hasNoOffences()

    //  And when I click continue
    page.clickSubmit()

    //  Then I see an error
    page.shouldShowErrorSummary()
  })

  //  Scenario: complete page and navigate to alleged offences summary page
  //    When I continue to the next task / page
  //    Then I see the "alleged offences summary" page
  it('navigates to the next page (alleged offences summary)', function test() {
    cy.task('stubApplicationGet', { application: this.applicationWithData })
    AllegedOffencesPage.visit(this.applicationWithData)
    const page = new AllegedOffencesPage(this.applicationWithData)

    page.clickSubmit()

    Page.verifyOnPage(AllegedOffencesSummaryPage, this.applicationWithData)
  })
})
