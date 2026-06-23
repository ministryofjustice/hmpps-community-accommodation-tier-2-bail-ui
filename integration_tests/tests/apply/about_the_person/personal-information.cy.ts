import { Cas2Application } from '@approved-premises/api'
import { applicationFactory, personFactory } from '../../../../server/testutils/factories'
import WorkingMobilePhonePage from '../../../pages/apply/about_the_person/personal_information/workingMobilePhonePage'
import ImmigrationStatusPage from '../../../pages/apply/about_the_person/personal_information/immigrationStatusPage'
import GenderPage from '../../../pages/apply/about_the_person/personal_information/genderPage'
import PregnancyInformationPage from '../../../pages/apply/about_the_person/personal_information/pregnancyInformationPage'
import CustodyLocationPage from '../../../pages/apply/about_the_person/personal_information/custodyLocationPage'

import Page from '../../../pages/page'
import TaskListPage from '../../../pages/apply/taskListPage'

context('Personal information task', () => {
  const person = personFactory.build({ name: 'Roger Smith' })
  let applicationDataNoPersonal: unknown
  let applicationData: unknown

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(data => {
      applicationDataNoPersonal = { ...data, 'personal-information': {} }
      applicationData = { ...data }
    })
  })

  beforeEach(() => {
    //  Given I am logged in
    cy.signIn()
  })

  it('Completes the personal information task for a bail application', () => {
    const application = applicationFactory.build({
      person,
      data: applicationDataNoPersonal,
    })
    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the tasklist page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // The personal information task has not been started
    taskListPage.shouldShowTaskStatus('personal-information', 'Not yet started')

    // When I start the task
    taskListPage.visitTask('Add personal information')

    // Then I am on the phone page
    const phonePage = Page.verifyOnPage(WorkingMobilePhonePage, application)
    // When I complete the page and submit
    phonePage.checkErrorsAndSubmit()

    // Then I am on the custody location page
    const custodyPage = Page.verifyOnPage(CustodyLocationPage, application)
    // When I complete the page and submit
    custodyPage.checkErrorsAndSubmit()

    // Then I am on the immigration status page
    const immigrationPage = Page.verifyOnPage(ImmigrationStatusPage, application)
    // When I complete the page and submit
    immigrationPage.checkErrorsAndSubmit()

    // Then I am on the gender page
    const genderPage = Page.verifyOnPage(GenderPage, application)
    // When I complete the page and submit
    genderPage.checkErrorsAndSubmit()

    // Then I am on the pregancy information page
    const pregnancyPage = Page.verifyOnPage(PregnancyInformationPage, application)
    // When I complete the page and submit
    pregnancyPage.checkErrorsAndSubmit()

    // Then I am back on the task list
    taskListPage.checkOnPage()
    // And the task is now completed
    taskListPage.shouldShowTaskStatus('personal-information', 'Completed')

    // When I navigate to the pregnancy page
    PregnancyInformationPage.visit(application)
    pregnancyPage.checkOnPage()
    // And I click back
    pregnancyPage.clickBack()

    // Then I am on the gender page
    genderPage.checkOnPage()
    // When I click back
    genderPage.clickBack()

    // Then I am on the immigration status page
    immigrationPage.checkOnPage()
    // When I click back
    immigrationPage.clickBack()

    // Then I am on the custody location page
    custodyPage.checkOnPage()
    // When I click back
    custodyPage.clickBack()

    // Then I am on the phone page
    phonePage.checkOnPage()
    // When I click back
    phonePage.clickBack()
    // Then I am back on the task list
    taskListPage.checkOnPage()
  })

  it('Completes the personal information task for an atcr application where the custody location is skipped', () => {
    const application = applicationFactory.build({
      person,
      applicationOrigin: 'other',
      cohort: 'from_ap',
      data: applicationDataNoPersonal,
    })
    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the tasklist page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // The personal information task has not been started
    taskListPage.shouldShowTaskStatus('personal-information', 'Not yet started')

    // When I start the task
    taskListPage.visitTask('Add personal information')
    // Then I am on the phone page
    const phonePage = Page.verifyOnPage(WorkingMobilePhonePage, application)
    // When I complete the page and submit
    phonePage.checkErrorsAndSubmit()

    // Then I am on the immigration status page
    const immigrationPage = Page.verifyOnPage(ImmigrationStatusPage, application)
    // When I complete the page and submit
    immigrationPage.checkErrorsAndSubmit()

    // Then I am on the gender page
    const genderPage = Page.verifyOnPage(GenderPage, application)
    // When I complete the page and submit
    genderPage.checkErrorsAndSubmit()

    // Then I am on the pregancy information page
    const pregnancyPage = Page.verifyOnPage(PregnancyInformationPage, application)
    // When I complete the page and submit
    pregnancyPage.checkErrorsAndSubmit()

    // Then I am on the task list with the task completed
    taskListPage.checkOnPage()
    taskListPage.shouldShowTaskStatus('personal-information', 'Completed')

    // When I navigate to the pregnancy page
    PregnancyInformationPage.visit(application)
    pregnancyPage.checkOnPage()

    // And I click back
    pregnancyPage.clickBack()
    // Then I am on the gender page
    genderPage.checkOnPage()

    // When I click back
    genderPage.clickBack()
    // Then I am on the immigration status page
    immigrationPage.checkOnPage()

    // When I click back
    immigrationPage.clickBack()
    // Then I am on the phone page
    phonePage.checkOnPage()

    // When I click back
    phonePage.clickBack()
    // Then I am back on the task list
    taskListPage.checkOnPage()
  })

  it('should remove orphaned data (custody locaton for non custody cohorts)', () => {
    applicationData['cohort-selection']['cohort-selection'] = { cohort: 'from_ap' }
    const application = applicationFactory.build({
      person,
      applicationOrigin: 'other',
      cohort: 'from_ap',
      data: applicationData,
    })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the tasklist page
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // and my application has a custody location populated
    expect(Object.keys(application.data['personal-information']['custody-location'])).to.have.length(1)

    // When I access the personal information task
    taskListPage.visitTask('Add personal information')
    const phonePage = Page.verifyOnPage(WorkingMobilePhonePage, application)

    // And I submit the first page
    phonePage.clickSubmit()

    // Then I verify that the custody location information has been deleted
    cy.task('verifyApplicationUpdate', application.id).then((requests: Array<unknown>) => {
      const lastPostData = requests.pop() as { body: string }
      const app = JSON.parse(lastPostData.body) as Cas2Application
      expect(app.data['personal-information']['custody-location']).eq(undefined)
    })
  })
})
