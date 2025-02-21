//  Scenario: view confirm submission page
//  Given I'm on the task list page
//  When I select 'Submit application'
//  Then I see the confirm submission page

//  Scenario: confirm submission
//  Given I'm on the confirm submission page
//  When I select 'Yes, I am sure'
//  Then I see the submission confirmation page

//  Scenario: return to task list
//  Given I'm on the confirm submission page
//  When I select 'Go back to edit application'
//  Then I see the task list page

import Page from '../../../pages/page'
import { personFactory, applicationFactory } from '../../../../server/testutils/factories/index'
import TaskListPage from '../../../pages/apply/taskListPage'
import ConfirmSubmissionPage from '../../../pages/apply/submit_application/confirmSubmissionPage'
import ApplicationSubmittedPage from '../../../pages/apply/submit_application/applicationSubmittedPage'

context('Confirm submission page', () => {
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
    //  Given a complete application exists
    // -------------------------
    cy.task('stubApplicationGet', { application: this.application })

    // Given I am logged in
    //---------------------
    cy.signIn()
  })

  //  Scenario: view confirm submission page
  it('presents confirm submission page', function test() {
    //  Given I'm on the task list page
    const page = TaskListPage.visit(this.application)

    //  When I select 'Submit application'
    page.clickLink('Submit application')

    //  Then I see the confirm submission page
    Page.verifyOnPage(ConfirmSubmissionPage, this.application.person.name)
  })

  //  Scenario: confirm submission
  it('continues to submission confirmed page', function test() {
    cy.task('stubApplicationSubmit', {})
    cy.task('stubSignIn')

    //  Given I'm on the confirm submission page
    const page = ConfirmSubmissionPage.visit(this.application)
    Page.verifyOnPage(ConfirmSubmissionPage, this.application.person.name)

    //  When I select 'Yes, I am sure'
    page.clickSubmit('Yes, I am sure')

    //  Then I see the submission confirmation page
    const applicationSubmittedPage = Page.verifyOnPage(ApplicationSubmittedPage, this.application)
    applicationSubmittedPage.shouldShowApplicationDetails()
  })

  //  Scenario: return to task list
  it('returns to task list', function test() {
    //  Given I'm on the confirm submission page
    const page = ConfirmSubmissionPage.visit(this.application)

    //  When I select 'Go back to edit application'
    page.clickLink('Go back to edit application')

    //  Then I see the task list page
    Page.verifyOnPage(TaskListPage)
  })
})
