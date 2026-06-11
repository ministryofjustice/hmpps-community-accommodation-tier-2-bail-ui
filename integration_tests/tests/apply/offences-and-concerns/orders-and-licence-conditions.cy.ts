import Page from '../../../pages/page'
import { personFactory, applicationFactory } from '../../../../server/testutils/factories'
import TaskListPage from '../../../pages/apply/taskListPage'
import LicenceConditionsPage from '../../../pages/apply/offences-and-concerns/orders-and-licence-conditions/licenceConditionsPage'
import OrdersPage from '../../../pages/apply/offences-and-concerns/orders-and-licence-conditions/ordersPage'

context('Complete the "Current offences" task in "Offences and concerns"', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      applicationData['referrer-details'] = {}
      cy.wrap(applicationData).as('applicationData')
    })
  })

  beforeEach(() => {
    //  Given I am logged in
    cy.signIn()
  })

  it('Runs the "Add current offences task"', function test() {
    const application = applicationFactory.newCohort().build({
      person,
      data: { ...this.applicationData, 'current-offences': undefined },
    })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the 'Tasklist' page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // Then the orders and licence conditions task should be not started
    taskListPage.shouldShowTaskStatus('orders-and-licence-conditions', 'Not yet started')

    // When I run the orders and licence conditions task
    taskListPage.visitTask('Add orders and licence conditions')

    // Then I am on the licence conditions page
    const licenceConditionsPage = Page.verifyOnPage(LicenceConditionsPage, application)

    // When I complete the licence form and submit
    licenceConditionsPage.checkErrorsAndSubmit()

    // Then I am on the orders page
    const ordersPage = Page.verifyOnPage(OrdersPage, application)

    // When I complew the orders form and submit
    ordersPage.checkErrorsAndSubmit()

    // Then I am back on the tasklist and the task is complete
    taskListPage.checkOnPage()
    taskListPage.shouldShowTaskStatus('orders-and-licence-conditions', 'Completed')

    // When I visit the task and go to the orders page
    taskListPage.visitTask('Add orders and licence conditions')
    licenceConditionsPage.checkOnPage()
    licenceConditionsPage.clickSubmit()
    ordersPage.checkOnPage()

    // And I click through the backlinks
    ordersPage.clickBack()
    licenceConditionsPage.checkOnPage()
    licenceConditionsPage.clickBack()

    // Then I am back on the tasklist again
    taskListPage.checkOnPage()
  })

  it('Does not shoe the task on bail applications', function test() {
    const application = applicationFactory.build({
      person,
      data: { ...this.applicationData, 'current-offences': undefined },
    })

    cy.task('stubApplicationGet', { application })

    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // Then the orders and licence conditions task should be not started
    taskListPage.shouldNotShowTask('Add orders and licence conditions')
  })
})
