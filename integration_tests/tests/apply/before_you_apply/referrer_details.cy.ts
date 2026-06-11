import Page from '../../../pages/page'
import { personFactory, applicationFactory, cas2v2UserDtoFactory } from '../../../../server/testutils/factories'
import ConfirmDetailsPage from '../../../pages/apply/before_you_apply/referrer_details/confirmDetailsPage'
import JobTitlePage from '../../../pages/apply/before_you_apply/referrer_details/jobTitlePage'
import ContactNumberPage from '../../../pages/apply/before_you_apply/referrer_details/contactNumberPage'
import LocationPage from '../../../pages/apply/before_you_apply/referrer_details/locationPage'
import TaskListPage from '../../../pages/apply/taskListPage'
import CppCheckPage from '../../../pages/apply/before_you_apply/referrer_details/cppCheck'
import CPPDetailsPage from '../../../pages/apply/offences-and-concerns/probation-supervision-details/cppDetailsPage'

context('Complete "Confirm details" page in "Referrer details" task', () => {
  const person = personFactory.build({ name: 'Roger Smith' })
  const userDetails = cas2v2UserDtoFactory.build({ username: 'USER1' })

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

  beforeEach(function test() {
    //  Given I am logged in
    cy.signIn()
  })

  it('runs the referrer details task for a bail aplication', function test() {
    const application = applicationFactory.build({
      person,
      data: this.applicationData,
    })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })
    // Given I am on the 'Confirm details' page
    ConfirmDetailsPage.visit(application)
    const confirmDetailsPage = Page.verifyOnPage(ConfirmDetailsPage, application)

    //  When I click 'Save and continue'
    confirmDetailsPage.clickSubmit()

    // Then I am on the 'Job title' page
    const jobTitlePage = Page.verifyOnPage(JobTitlePage, application)

    // When I complete the form and submit
    jobTitlePage.checkErrorsAndSubmit()

    // Then I am on the 'contact number' page
    const contactNumberPage = Page.verifyOnPage(ContactNumberPage, application)

    // When I complete the form and submit
    contactNumberPage.checkErrorsAndSubmit()

    // Then I am on the 'location' page
    const locationPage = Page.verifyOnPage(LocationPage, application)

    // When I complete the page and submit
    locationPage.checkErrorsAndSubmit()

    // Then I am on the task list
    const taskListPage = Page.verifyOnPage(TaskListPage, application)
    taskListPage.shouldShowTaskStatus('referrer-details', 'Completed')

    // When I return to the location page page
    LocationPage.visit(application)

    // Then I can click back though the whole task
    locationPage.clickBack()
    contactNumberPage.checkOnPage()
    locationPage.clickBack()
    jobTitlePage.checkOnPage()
    jobTitlePage.clickBack()
    confirmDetailsPage.checkOnPage()
    jobTitlePage.clickBack()

    // And I see the task list
    Page.verifyOnPage(TaskListPage, application)
  })

  it('runs the referrer details task for a new cohorts aplication - referrer is the cpp', function test() {
    // Given I am on the 'Confirm details' page
    const application = applicationFactory.build({
      person,
      applicationOrigin: 'other',
      cohort: 'hcrd',
      data: this.applicationData,
    })
    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    ConfirmDetailsPage.visit(application)
    const confirmDetailsPage = Page.verifyOnPage(ConfirmDetailsPage, application)

    //  When I click 'Save and continue'
    confirmDetailsPage.clickSubmit()

    // Then I am on the 'Are you the person's cpp?' page
    const cppCheckPage = Page.verifyOnPage(CppCheckPage, application)
    cppCheckPage.clickSubmit()
    cppCheckPage.checkErrors()

    cppCheckPage.completeForm('yes')
    cppCheckPage.clickSubmit()
    cy.task('stubApplicationGetFromLastUpdate', { application })
    cy.reload()

    // Then I am on the contact number page
    const contactNumberPage = Page.verifyOnPage(ContactNumberPage, application)

    // When I complete the form and submit
    contactNumberPage.checkErrorsAndSubmit()

    // Then I am on the task list
    const taskListPage = Page.verifyOnPage(TaskListPage, application)
    taskListPage.shouldShowTaskStatus('referrer-details', 'Completed')

    // When I return to the contact number page
    ContactNumberPage.visit(application)
    contactNumberPage.checkOnPage()

    // Then I click back though all the pages in the task
    contactNumberPage.clickBack()
    cppCheckPage.checkOnPage()
    cppCheckPage.clickBack()
    confirmDetailsPage.checkOnPage()
    confirmDetailsPage.clickBack()

    // Then I am back on the task list
    Page.verifyOnPage(TaskListPage, application)
  })

  it('runs the referrer details task for a new cohorts aplication - referrer is not the cpp', function test() {
    // Given I am on the 'Confirm details' page
    const application = applicationFactory.build({
      person,
      applicationOrigin: 'other',
      cohort: 'hcrd',
      data: this.applicationData,
    })
    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    ConfirmDetailsPage.visit(application)
    const confirmDetailsPage = Page.verifyOnPage(ConfirmDetailsPage, application)

    // When I click 'Save and continue'
    confirmDetailsPage.clickSubmit()

    // Then I am on the 'Are you the person's cpp?' page
    const cppCheckPage = Page.verifyOnPage(CppCheckPage, application)
    cppCheckPage.clickSubmit()
    cppCheckPage.checkErrors()

    cppCheckPage.completeForm('no')
    cppCheckPage.clickSubmit()
    cy.task('stubApplicationGetFromLastUpdate', { application })
    cy.reload()

    // Then I am on the cpp details page
    const cppDetailsPage = Page.verifyOnPage(CPPDetailsPage, application)

    // When I complete the form and submit
    cppDetailsPage.checkErrorsAndSubmit()

    // Then I am on the job title page
    const jobPage = Page.verifyOnPage(JobTitlePage, application)
    jobPage.checkErrorsAndSubmit()

    // Then I am on the contact number page
    const contactNumberPage = Page.verifyOnPage(ContactNumberPage, application)
    contactNumberPage.checkErrorsAndSubmit()

    // Then I am on the location page
    const locationPage = Page.verifyOnPage(LocationPage, application)
    locationPage.checkErrorsAndSubmit()

    // Then I am on the task list page
    Page.verifyOnPage(TaskListPage, application)

    // When I return to the locationpage
    LocationPage.visit(application)
    locationPage.checkOnPage()

    // And I click back though all the pages in the task
    locationPage.clickBack()

    contactNumberPage.checkOnPage()
    contactNumberPage.clickBack()

    jobPage.checkOnPage()
    jobPage.clickBack()

    cppDetailsPage.checkOnPage()
    cppDetailsPage.clickBack()

    cppCheckPage.checkOnPage()
    cppCheckPage.clickBack()

    confirmDetailsPage.checkOnPage()
    confirmDetailsPage.clickBack()

    // Then I am back on the task list
    const taskListPage = Page.verifyOnPage(TaskListPage, application)
    taskListPage.shouldShowTaskStatus('referrer-details', 'Completed')
  })
})
