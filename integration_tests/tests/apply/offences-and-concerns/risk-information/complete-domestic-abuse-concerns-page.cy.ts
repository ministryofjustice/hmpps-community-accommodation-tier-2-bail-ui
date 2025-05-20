/* eslint-disable no-param-reassign */
//  Feature: Referrer completes "risk information: domestic abuse" page
//    So that I can complete the "risk information" task
//    As a referrer
//    I want to complete the 'domestic abuse' cover page
//
//  Background:
//    Given an application exists
//    And I am logged in
//    And I am on the domestic abuse page
//
//  Scenario: view domestic abuse questions
//    Then I see the "domestic abuse" page
//
//  Scenario: answer yes and continue to domestic abuse concerns page
//    When I confirm that there are concerns relating to domestic abuse
//    And I continue to the next task / page
//    Then I see the "details of domestic abuse concerns" page
//
//  Scenario: answer no and continue to violence and arson page
//    When I confirm that there are no concerns relating to domestic abuse
//    And I continue to the next task / page
//    Then I see the "violence and arson" page

import ViolenceAndArsonPage from '../../../../pages/apply/offences-and-concerns/risk-information/violenceAndArsonPage'
import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import DomesticAbuseConcernsPage from '../../../../pages/apply/offences-and-concerns/risk-information/domesticAbuseConcernsPage'
import DetailsOfDomesticAbuseConcernsPage from '../../../../pages/apply/offences-and-concerns/risk-information/detailsOfDomesticAbuseConcernsPage'

context('Complete "domestic abuse" page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['risk-information'] = {}
      const application = applicationFactory.build({
        id: 'abc123',
        person,
      })
      application.data = applicationData
      cy.wrap(application).as('application')
      cy.wrap(application.data).as('applicationData')
    })
  })

  beforeEach(function test() {
    // And an application exists
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()

    // And I visit the domestic abuse page
    // --------------------------------
    cy.visit('applications/abc123/tasks/risk-information/pages/domestic-abuse-concerns')
  })

  //  Scenario: view domestic abuse questions
  //    Then I see the "domestic abuse" page
  it('presents the domestic abuse page', function test() {
    const page = Page.verifyOnPage(DomesticAbuseConcernsPage, this.application)

    page.hasGuidance()
  })

  //  Scenario: answer yes and continue to domestic abuse concerns page
  it('navigates to the domestic abuse concerns page', function test() {
    //  When I confirm that there are concerns relating to domestic abuse
    DomesticAbuseConcernsPage.visit(this.application)
    const page = new DomesticAbuseConcernsPage(this.application)

    page.confirmDomesticAbuseConcerns()

    //  And I continue to the next task / page
    page.clickSubmit()

    //  Then I see the "details of domestic abuse concerns" page
    Page.verifyOnPage(DetailsOfDomesticAbuseConcernsPage, this.application)
  })

  //  Scenario: answer no and continue to violence and arson page
  it('navigates to the violence and arson page', function test() {
    //  When I confirm that there are no concerns relating to domestic abuse
    DomesticAbuseConcernsPage.visit(this.application)
    const page = new DomesticAbuseConcernsPage(this.application)

    page.confirmNoDomesticAbuseConcerns()

    //  And I continue to the next task / page
    page.clickSubmit()

    //  Then I see the "violence and arson" page
    Page.verifyOnPage(ViolenceAndArsonPage, this.application)
  })
})
