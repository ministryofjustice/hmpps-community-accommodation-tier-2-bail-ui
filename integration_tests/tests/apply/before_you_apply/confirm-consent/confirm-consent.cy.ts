/* eslint-disable no-param-reassign */
//  Feature: Referrer completes 'Confirm consent' task
//    So that I can complete the 'Confirm consent' task
//    As a referrer
//    I want to answer questions within that task
//
//  Background:
//    Given I am logged in
//    And I have confirmed the user is eligible for CAS-2
//    And I'm now faced with the 'Confirm consent' task
//
//  Scenario: Confirms that the person has given consent
//    When I confirm that the person has given consent
//    And I continue to the next task
//    Then I see that the 'Confirm consent' task is complete
//
//  Scenario: Confirms that the person has NOT given consent
//    When I confirm that the person has NOT given consent
//    And I continue to the next task
//    Then I see that I have marked that this person has not given consent
//    And I am on the 'consent refused' page
//    And I am provided with a way of changing the consent answer
//
//  Scenario: Changes consent answer: from NO to YES
//    Given I have confirmed that the person has not given consent
//    And I am on the 'consent refused' page
//    When I choose to change my consent answer
//    I confirm that the person has given consent
//    And I continue to the next task
//    Then I see that the 'Confirm consent' task is complete
//
//  Scenario: Continues with application
//    Given I have confirmed that the person has not given consent
//    And I am on the 'consent refused' page
//    When I opt to continue
//    Then I see the task list page
//    And I see that the 'Confirm consent' task is in progress

import Page from '../../../../pages/page'
import TaskListPage from '../../../../pages/apply/taskListPage'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories/index'
import ConfirmConsentPage from '../../../../pages/apply/before_you_apply/confirm-consent/confirmConsentPage'
import ConsentRefusedPage from '../../../../pages/apply/before_you_apply/confirm-consent/consentRefusedPage'

context('Complete "Confirm consent" task in "Before you start" section', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['confirm-consent'] = {}
      const application = applicationFactory.build({
        id: 'abc123',
        person,
        data: applicationData,
      })
      cy.wrap(application).as('application')
    })
  })

  beforeEach(function test() {
    cy.wrap({
      ...this.application,
      data: {
        ...this.application.data,
        'confirm-consent': {
          'confirm-consent': {
            hasGivenConsent: 'yes',
            consentDate: '2023-01-01',
            'consentDate-year': '2023',
            'consentDate-month': '1',
            'consentDate-day': '1',
          },
        },
      },
    }).as('applicationWithConsent')

    cy.wrap({
      ...this.application,
      data: {
        ...this.application.data,
        'confirm-consent': {
          'confirm-consent': {
            hasGivenConsent: 'no',
            consentRefusalDetail: 'some reasons',
          },
        },
      },
    }).as('applicationWithConsentRefused')

    //  Background:
    //    Given I am logged in
    cy.signIn()
    //    And I have confirmed the user is eligible for CAS-2
    cy.task('stubApplicationGet', { application: this.application })
    cy.task('stubApplicationUpdate', { application: this.application })

    ConfirmConsentPage.visit(this.application)

    //   And I'm now faced with the 'Confirm consent' task
    Page.verifyOnPage(ConfirmConsentPage, this.application)
  })

  //  Scenario: Confirms that the person has given consent
  //    When I confirm that the person has given consent
  //    And I continue to the next task
  //    Then I see that the 'Confirm consent' task is complete
  it('allows consent to be confirmed', function test() {
    const page = Page.verifyOnPage(ConfirmConsentPage, this.application)

    // When I select the 'Yes' option and click save and continue
    page.completeFormWithConsent()

    // after submission of the valid form the API will return the answered question
    // -- note that it this case the value must be yes or no to indicate that the
    //    'Confirm consent' task is complete
    cy.task('stubApplicationGet', { application: this.applicationWithConsent })

    page.clickSubmit('Confirm and continue')

    // Then I return to the task list
    const taskListPage = Page.verifyOnPage(TaskListPage)

    // And I see that the task is now complete
    taskListPage.shouldShowTaskStatus('confirm-consent', 'Completed')
  })

  //  Scenario: Confirms that the person has NOT given consent
  //    When I confirm that the person has NOT given consent
  //    And I continue to the next task
  //    Then I see that I have marked that this person has not given consent
  //    And I am on the 'consent refused' page
  //    And I am provided with a way of changing the consent answer
  it('allows NO CONSENT to be confirmed', function test() {
    const page = Page.verifyOnPage(ConfirmConsentPage, this.application)

    // When I select the 'NO' option and click save and continue
    page.completeFormWithoutConsent()

    // after submission of the valid form the API will return the answered question
    // -- note that it this case the value must be yes or no to indicate that the
    //    'Confirm consent' task is complete
    cy.task('stubApplicationGet', { application: this.applicationWithConsentRefused })

    page.clickSubmit('Confirm and continue')

    // Then I see that I have marked that this person has not given consent
    // And I am on the 'consent refused' page
    const consentRefusedPage = Page.verifyOnPage(ConsentRefusedPage, this.application)
    consentRefusedPage.hasGuidance()
    // And I am provided with a way of changing the eligibility answer)
    consentRefusedPage.hasLinkToChangeAnswer()
  })

  //  Scenario: Changes consent answer: from NO to YES
  //    Given I have confirmed that the person has not given consent
  //    And I am on the 'consent refused' page
  //    When I choose to change my consent answer
  //    I confirm that the person has given consent
  //    And I continue to the next task
  //    Then I see that the 'Confirm consent' task is complete
  it('allows consent answer to be changed from NO to YES', function test() {
    //  Given I have confirmed that the person has not given consent
    cy.task('stubApplicationGet', { application: this.applicationWithConsentRefused })

    // And I am on the 'consent refused' page
    ConsentRefusedPage.visit(this.application)
    const page = Page.verifyOnPage(ConsentRefusedPage, this.application)

    //  When I choose to change my consent answer
    page.chooseToChangeAnswer()

    //  I confirm that the person has given consent
    const confirmConsentPage = new ConfirmConsentPage(this.application)
    confirmConsentPage.completeFormWithConsent()

    //  And I continue to the next task
    cy.task('stubApplicationGet', { application: this.applicationWithConsent })
    confirmConsentPage.clickSubmit('Confirm and continue')

    // Then I see that the 'Confirm consent' task is complete
    const taskListPage = Page.verifyOnPage(TaskListPage)
    taskListPage.shouldShowTaskStatus('confirm-consent', 'Completed')
  })

  //  Scenario: Continues with application
  //    Given I have confirmed that the person has not given consent
  //    And I am on the 'consent refused' page
  //    When I opt to continue
  //    Then I see the task list page
  //    And I see that the 'Confirm consent' task is in progress
  it('allows the referrer to answer NO and continue with the application', function test() {
    //  Given I have confirmed that the person has not given consent
    cy.task('stubApplicationGet', { application: this.applicationWithConsentRefused })

    // And I am on the 'consent refused' page
    ConsentRefusedPage.visit(this.application)
    const page = Page.verifyOnPage(ConsentRefusedPage, this.application)

    // When I opt to continue
    page.clickSubmit()

    // Then I see the task list page
    const taskListPage = Page.verifyOnPage(TaskListPage, this.application)

    // And I see that the 'Confirm consent' task is in progress
    taskListPage.shouldShowTaskStatus('confirm-consent', 'In progress')
  })
})
