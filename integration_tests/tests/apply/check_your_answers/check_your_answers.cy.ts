//  Scenario: check my answers
//  Given a complete application exists
//  When I view the 'check your answers' page
//  Then I see a list of questions and answers for the application

import { ApplicationOrigin } from '@approved-premises/api'
import Page from '../../../pages/page'
import CheckYourAnswersPage from '../../../pages/apply/check_your_answers/check-your-answers/checkYourAnswersPage'
import { personFactory, applicationFactory } from '../../../../server/testutils/factories/index'
import TaskListPage from '../../../pages/apply/taskListPage'
import { getSections, taskAppliesToApplication } from '../../../../server/utils/checkYourAnswersUtils'

context('Check your answers page', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(function test() {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['check-your-answers']['check-your-answers']
      cy.wrap(applicationData).as('applicationData')
    })
  })

  beforeEach(function test() {
    // Given I am logged in
    //---------------------
    cy.signIn()
  })

  //  Scenario: check my answers
  //  When I view the 'check your answers' page
  //  Then I see a list of questions and answers for the application
  it('presents check your answers page', function test() {
    const applicationOrigins: ReadonlyArray<ApplicationOrigin> = ['prisonBail', 'other']

    applicationOrigins.forEach(applicationOrigin => {
      const application =
        applicationOrigin === 'other'
          ? applicationFactory.newCohort('hcrd').build({ person, data: this.applicationData })
          : applicationFactory.build({ applicationOrigin, person, data: this.applicationData })
      cy.task('stubApplicationGet', { application })
      cy.task('stubApplicationUpdate', { application })

      //  When I view the 'check your answers' page
      TaskListPage.visit(application)
      const taskListPage = Page.verifyOnPage(TaskListPage, application)
      taskListPage.visitTask('Check application answers')
      const page = Page.verifyOnPage(CheckYourAnswersPage, application)

      //  Then I see a download button
      page.shouldShowPrintButton('Download as a PDF')

      //  And I see a list of questions and answers for the application
      page.hasExpectedSummaryData()
      page.hasApplicantDetails(application)
      page.shouldShowSideNavBar()
      page.shouldNotShowAnswersWithoutQuestions()

      //  And tasks that belong to another application origin are not shown at all
      const sections = getSections()
      sections.forEach(section => {
        section.tasks.forEach(task => {
          if (taskAppliesToApplication(task, application)) {
            page.shouldShowAnswersForTask(task)
          } else {
            page.shouldNotShowTask(task)
          }
        })
      })
    })
  })

  //  Scenario: check my answers
  //  When I view the 'check your answers' page
  //  And I confirm the information is correct
  //  Then I am taken to the task list page
  it('navigates to the task list page once the referrer confirms details are correct', function test() {
    const application = applicationFactory.build({
      person,
      data: this.applicationData,
    })
    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    //  When I view the 'check your answers' page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)
    taskListPage.visitTask('Check application answers')
    const page = Page.verifyOnPage(CheckYourAnswersPage, application)

    //  When I confirm the information is correct
    page.checkCheckboxByValue('confirmed')

    //  When I continue to the next task / page
    page.clickSubmit()

    //  Then I am taken to the task list page
    Page.verifyOnPage(TaskListPage, application)
  })
})
