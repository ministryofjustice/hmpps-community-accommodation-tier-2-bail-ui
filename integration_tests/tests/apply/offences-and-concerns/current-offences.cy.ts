import Page from '../../../pages/page'
import { personFactory, applicationFactory, cas2v2UserDtoFactory } from '../../../../server/testutils/factories'
import TaskListPage from '../../../pages/apply/taskListPage'
import CurrentOffencesDataPage, {
  Offence,
} from '../../../pages/apply/offences-and-concerns/current-offences/currentOffencesData'
import CurrentOffencesPage from '../../../pages/apply/offences-and-concerns/current-offences/currentOffences'

context('Complete the "Current offences" task in "Offences and concerns"', () => {
  const person = personFactory.build({ name: 'Roger Smith' })
  const userDetails = cas2v2UserDtoFactory.build({ username: 'USER1' })

  const offences: Array<Offence> = [
    {
      title: 'Offence 1 title',
      offenceCategory: 'Arson',
      offenceDate: '2026-02-15',
      sentenceLength: '5 years',
      summary: 'Some summary for offence 1',
    },
    {
      title: 'Offence 2 title',
      offenceCategory: 'Violence',
      offenceDate: '2022-11-30',
      sentenceLength: '4 months',
      summary: 'Some summary for offence 2',
    },
  ]

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubUserDetails', userDetails)

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['referrer-details'] = {}
      cy.wrap(applicationData).as('applicationData')
    })
  })

  beforeEach(() => {
    // Given I am logged in
    cy.signIn()
  })

  it('Runs the "Add current offences task" and adds one task to the application', function test() {
    const application = applicationFactory.build({
      applicationOrigin: 'other',
      cohort: 'hefr',
      person,
      data: { ...this.applicationData, 'current-offences': undefined },
    })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the 'Tasklist' page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // I should not see the alleged offences task as this is bail only
    taskListPage.shouldNotShowTask('alleged-offences')

    // And the current offences task is shown but has not been started
    taskListPage.shouldShowTaskStatus('current-offences', 'Not yet started')

    // When I start the task
    taskListPage.visitTask('Add current offences')

    // Then I am on the current-offences data page
    const dataPage = Page.verifyOnPage(CurrentOffencesDataPage, application)

    // And the back-link returns me to the tasklist
    dataPage.clickBack()
    taskListPage.checkOnPage()
    taskListPage.visitTask('Add current offences')

    // When I submit the page I see mandatory errors
    dataPage.clickSubmit()
    dataPage.checkErrors()

    // When I complete the form and submit
    dataPage.completeForm(offences[0])
    dataPage.clickSubmit('Save and continue')
    dataPage.refreshMock()

    // Then I am on the offences list page and the offence is listed
    const listPage = Page.verifyOnPage(CurrentOffencesPage, application)
    listPage.checkOffence(offences[0])

    // When I click add another offence
    listPage.clickLink('Add a current offence')
    // Then I am on the data page
    dataPage.checkOnPage()

    // When I add another offencxe
    dataPage.completeForm(offences[1])
    dataPage.clickSubmit('Save and continue')
    dataPage.refreshMock()

    // Then I see two offences on the list page
    listPage.checkOnPage()
    listPage.checkOffence(offences[0])
    listPage.checkOffence(offences[1])

    // When I remove the first one one
    listPage.clickLink('Remove')
    listPage.refreshMock()

    // Then there is only one left
    listPage.checkOnPage()
    listPage.checkOffence(offences[1])
    cy.get('.govuk-summary-card').should('have.length', 1)

    // Whan I click Save and continue
    listPage.clickSubmit('Save and continue')
    listPage.refreshMock()

    // Then I am back on the tasklist
    taskListPage.checkOnPage()
    // And the task should be complete
    taskListPage.shouldShowTaskStatus('current-offences', 'Completed')

    // When I select the task again
    taskListPage.visitTask('Add current offences')
    // Then I see the list of offences (as it's no longer empty)
    listPage.checkOnPage()
    cy.get('.govuk-summary-card').should('have.length', 1)

    // When I hit back
    listPage.clickBack()
    // Then I am back on the task list
    taskListPage.checkOnPage()
  })

  it('Should not show the current offences task for a bail application', function test() {
    const application = applicationFactory.build({
      person,
      data: this.applicationData,
    })
    cy.task('stubApplicationGet', { application })

    // Given I am on the 'Tasklist' page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // I should not see the alleged offences task as this is bail only
    taskListPage.shouldShowTaskStatus('alleged-offences', 'Completed')

    // And the current offences task should not be available
    taskListPage.shouldNotShowTask('current-offences')
  })
})
