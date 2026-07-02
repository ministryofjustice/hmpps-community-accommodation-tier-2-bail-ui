import { Cas2Application } from '@approved-premises/api'
import { applicationFactory, personFactory } from '../../../../server/testutils/factories'
import TaskListPage from '../../../pages/apply/taskListPage'
import Page from '../../../pages/page'

context('Task list page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  let applicationData: Record<string, string>

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(appData => {
      delete appData['check-your-answers']['check-your-answers']
      applicationData = appData

      // Given I am logged in
      //---------------------
      cy.signIn()
    })
  })

  it('shows the correct tasks for a new cohort application', function test() {
    const otherApplication: Cas2Application = applicationFactory.newCohort('rarr').build({
      person,
      data: applicationData,
    })
    cy.task('stubApplicationGet', { application: otherApplication })

    // Given that I am on the task-list page
    TaskListPage.visit(otherApplication)
    const taskListPage = Page.verifyOnPage(TaskListPage)

    // Then the bail tasks do not show
    taskListPage.shouldNotShowTask('Add bail conditions')
    taskListPage.shouldNotShowTask('Add bail hearing information')

    // And the  "Add information about concerns to the applicant and others" is not shown
    taskListPage.shouldNotShowTask('Add information about concerns to the applicant and others')

    // And the bail section should not appear
    taskListPage.shouldShowSections([
      'Before you apply',
      'About the applicant',
      'Area, funding and ID',
      'Offences and concerns',
      'Health needs',
      'Check answers',
    ])
  })

  it('shows the correct tasks for a bail application', function test() {
    const application = applicationFactory.build({
      person,
      data: applicationData,
    })

    cy.task('stubApplicationGet', { application })

    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage)

    // Then the bail tasks should be shown
    taskListPage.shouldShowTaskStatus('bail-conditions', 'Completed')
    taskListPage.shouldShowTaskStatus('bail-hearing-information', 'Completed')

    // And the  "Add information about concerns to the applicant and others" is shown
    taskListPage.shouldShowTaskStatus('risk-information', 'Completed')

    // And the bail section should appear
    taskListPage.shouldShowSections([
      'Before you apply',
      'About the applicant',
      'Area, funding and ID',
      'Offences and concerns',
      'Health needs',
      'Bail information',
      'Check answers',
    ])
  })
})
