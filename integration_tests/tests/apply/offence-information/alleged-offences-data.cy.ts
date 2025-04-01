//  Feature: Referrer completes 'Add alleged offence' page
//    So that I can complete the "Alleged offences" task
//    As a referrer
//    I want to complete the 'Add alleged offence' page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the "Add alleged offence" page
//
//  Scenario: I fill in required information for a alleged offence
//    And I save and contnue
//    Then I am taken to the 'alleged offences' page
//
//  Scenario: Add another offence
//    Given I have filled in required information for an offence
//    When I save and add another
//    Then I am taken to a blank "Add alleged offence" page
//    And I see a success message

import AllegedOffencesDataPage from '../../../pages/apply/offence-information/alleged-offences/allegedOffenceDataPage'
import AllegedOffencesPage from '../../../pages/apply/offence-information/alleged-offences/allegedOffencesPage'
import Page from '../../../pages/page'
import { personFactory, applicationFactory } from '../../../../server/testutils/factories/index'

context('Visit "Offence information" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
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

    // And I am on the "Add alleged offence" page
    // --------------------------------
    AllegedOffencesDataPage.visit(this.application)
  })

  //  Scenario: I fill in required information for a alleged offence
  //    When I continue to the next task / page
  //    Then I see the "alleged offences" page
  it('navigates to the next page', function test() {
    const page = new AllegedOffencesDataPage(this.application)

    page.addOffenceInformation()

    page.clickSubmit()

    Page.verifyOnPage(AllegedOffencesPage, this.application)
  })

  //  Scenario: Add another Offence
  it('returns to form when adding another', function test() {
    const page = new AllegedOffencesDataPage(this.application)

    //  Given I have filled in required information for an offence
    page.addOffenceInformation()

    //  When I save and add another
    page.clickAddAnother()

    //  Then I am taken to a blank "Add alleged offence" page
    Page.verifyOnPage(AllegedOffencesDataPage, this.application)
    page.assertFormisEmpty()

    //  And I see a success message
    page.shouldShowSuccessMessage('Alleged offence saved')
  })
})
