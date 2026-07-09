import Page from '../../../pages/page'
import {
  personFactory,
  applicationFactory,
  cas2v2UserDtoFactory,
  cas2OAsysRoshSummaryDtoFactory,
  cas2OAsysRoshRatingsDtoFactory,
} from '../../../../server/testutils/factories'
import TaskListPage from '../../../pages/apply/taskListPage'
import OasysImportPage from '../../../pages/apply/health_needs/risks-of-serious-harm-to-others/oasysImportPage'
import SummaryPage from '../../../pages/apply/health_needs/risks-of-serious-harm-to-others/summaryPage'
import OldOasysPage from '../../../pages/apply/health_needs/risks-of-serious-harm-to-others/oldOasysPage'
import ManualRoshInformationPage from '../../../pages/apply/health_needs/risks-of-serious-harm-to-others/manualRoshInformationPage'
import RiskToOthersPage from '../../../pages/apply/health_needs/risks-of-serious-harm-to-others/riskToOthersPage'
import RiskManagementArrangementsPage from '../../../pages/apply/health_needs/risks-of-serious-harm-to-others/riskManagementArrangementsPage'
import CellShareInformationPage from '../../../pages/apply/health_needs/risks-of-serious-harm-to-others/cellShareInformationPage'
import AdditionalRiskInformationPage from '../../../pages/apply/health_needs/risks-of-serious-harm-to-others/additionalRiskInformationPage'

context('Complete the "Risks of serious harm to others" task', () => {
  const person = personFactory.build({ name: 'Roger Smith' })
  const userDetails = cas2v2UserDtoFactory.build({ username: 'USER1' })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubUserDetails', userDetails)

    cy.fixture('applicationData.json').then(applicationData => {
      cy.wrap(applicationData).as('applicationData')
    })
  })

  beforeEach(function test() {
    // Given I am logged in
    cy.signIn()
  })

  it('is not shown on the task list for bail applications', function test() {
    // Given I have a bail application (prison bail is the factory default)
    const application = applicationFactory.build({ person, data: this.applicationData })
    cy.task('stubApplicationGet', { application })

    // When I visit the tasklist page
    const taskListPage = TaskListPage.visit(application)

    // Then the risks of serious harm to others task is not shown
    taskListPage.shouldNotShowTask('Risks of serious harm to others')
  })

  it('is shown on the task list for non-bail applications', function test() {
    // Given I have a non-bail application
    const application = applicationFactory.build({
      person,
      applicationOrigin: 'other',
      cohort: 'hcrd',
      data: this.applicationData,
    })
    cy.task('stubApplicationGet', { application })

    // When I visit the task list
    const taskListPage = TaskListPage.visit(application)

    // Then the risks of serious harm to others task is shown and not started
    taskListPage.shouldShowTaskStatus('risks-of-serious-harm-to-others', 'Not yet started')
  })

  it('completes the task by importing risk information from OASys', function test() {
    // Given I have a non-bail application with an applicable OASys assessment
    const application = applicationFactory.build({
      person,
      applicationOrigin: 'other',
      cohort: 'hcrd',
      data: this.applicationData,
    })
    const summary = cas2OAsysRoshSummaryDtoFactory.build({
      whoIsAtRisk: 'who is at risk answer',
      natureOfRisk: 'nature of risk answer',
      metadata: { hasApplicableAssessment: true, dateStarted: '2026-01-01', dateCompleted: '2026-01-02' },
    })
    const ratings = cas2OAsysRoshRatingsDtoFactory.build({ metadata: { hasApplicableAssessment: true } })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })
    cy.task('stubOasysRoshSummary', { crn: person.crn, summary })
    cy.task('stubOasysRoshRatings', { crn: person.crn, ratings })

    // Given I am on the task list
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // And the risk to others task has not started
    taskListPage.shouldShowTaskStatus('risks-of-serious-harm-to-others', 'Not yet started')

    // When I start the task
    taskListPage.visitTask('Risks of serious harm to others')

    // Then I am on the OASys import page
    const oasysImportPage = Page.verifyOnPage(OasysImportPage, application)

    // Then I am told OASys information is available to import
    oasysImportPage.shouldShowOasysRecordAvailable()

    // When I import the information
    oasysImportPage.importOasysInformation()
    cy.task('stubApplicationGetFromLastUpdate', { application })
    cy.reload()

    // Then I amm on the roSH summary page showing the imported risk widget
    const summaryPage = Page.verifyOnPage(SummaryPage, application)
    summaryPage.shouldShowImportedRiskWidget()
    summaryPage.clickSubmit()
    summaryPage.refreshMock()

    // Then I am on the risk to others page, pre-populated from oasys
    const riskToOthersPage = Page.verifyOnPage(RiskToOthersPage, application)
    riskToOthersPage.shouldShowImportedRiskInformation('who is at risk answer', 'nature of risk answer')
    riskToOthersPage.clickSubmit()
    riskToOthersPage.refreshMock()

    // Then I complete the remaining pages in the task
    const riskManagementArrangementsPage = Page.verifyOnPage(RiskManagementArrangementsPage, application)
    riskManagementArrangementsPage.checkErrorsAndSubmit()

    const cellShareInformationPage = Page.verifyOnPage(CellShareInformationPage, application)
    cellShareInformationPage.checkErrorsAndSubmit()

    const additionalRiskInformationPage = Page.verifyOnPage(AdditionalRiskInformationPage, application)
    additionalRiskInformationPage.checkErrorsAndSubmit()

    // Then the task is complete on the task list
    taskListPage.checkOnPage()
    taskListPage.shouldShowTaskStatus('risks-of-serious-harm-to-others', 'Completed')

    // When I go back into the task and keep going to all the pages
    taskListPage.visitTask('Risks of serious harm to others')
    summaryPage.checkOnPage()
    summaryPage.clickSubmit()
    riskToOthersPage.checkOnPage()
    riskToOthersPage.clickSubmit()
    riskManagementArrangementsPage.checkOnPage()
    riskManagementArrangementsPage.clickSubmit()
    cellShareInformationPage.checkOnPage()
    cellShareInformationPage.clickSubmit()
    additionalRiskInformationPage.checkOnPage()

    // And I click on all the back link butons
    additionalRiskInformationPage.clickBack()
    cellShareInformationPage.checkOnPage()
    cellShareInformationPage.clickBack()
    riskManagementArrangementsPage.checkOnPage()
    riskManagementArrangementsPage.clickBack()
    riskToOthersPage.checkOnPage()
    riskToOthersPage.clickBack()
    summaryPage.checkOnPage()
    summaryPage.clickBack()

    // Then I am back on the task list page
    taskListPage.checkOnPage()
  })

  it('completes the task manually when there is no OASys record', function test() {
    // Given I have a non-bail application with no applicable OASys assessment
    const application = applicationFactory.build({
      person,
      applicationOrigin: 'other',
      cohort: 'hcrd',
      data: this.applicationData,
    })
    const summary = cas2OAsysRoshSummaryDtoFactory.build({ metadata: { hasApplicableAssessment: false } })
    const ratings = cas2OAsysRoshRatingsDtoFactory.build({ metadata: { hasApplicableAssessment: false } })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })
    cy.task('stubOasysRoshSummary', { crn: person.crn, summary })
    cy.task('stubOasysRoshRatings', { crn: person.crn, ratings })

    // Given I am on the task list
    TaskListPage.visit(application)
    const taskListPage = Page.verifyOnPage(TaskListPage, application)

    // And the risk to others task has not started
    taskListPage.shouldShowTaskStatus('risks-of-serious-harm-to-others', 'Not yet started')

    // When I start the task
    taskListPage.visitTask('Risks of serious harm to others')

    // Then I am on the OASys import page
    const oasysImportPage = Page.verifyOnPage(OasysImportPage, application)

    // Then I am told there is no OASys record to import
    oasysImportPage.shouldShowNoOasysRecordBanner()

    // When I choose to continue manually
    oasysImportPage.continueWithoutOasys()

    // Then I am asked whether there is an older OASys, which there is not
    const oldOasysPage = Page.verifyOnPage(OldOasysPage, application)
    oldOasysPage.checkErrorsAndSubmit()

    // Then I create a RoSH summary manually
    const manualRoshInformationPage = Page.verifyOnPage(ManualRoshInformationPage, application)
    manualRoshInformationPage.checkErrorsAndSubmit()

    // Then I complete the risk to others page
    const riskToOthersPage = Page.verifyOnPage(RiskToOthersPage, application)
    riskToOthersPage.checkErrorsAndSubmit()

    // Then I complete the remaining pages in the task
    const riskManagementArrangementsPage = Page.verifyOnPage(RiskManagementArrangementsPage, application)
    riskManagementArrangementsPage.checkErrorsAndSubmit()

    const cellShareInformationPage = Page.verifyOnPage(CellShareInformationPage, application)
    cellShareInformationPage.checkErrorsAndSubmit()

    const additionalRiskInformationPage = Page.verifyOnPage(AdditionalRiskInformationPage, application)
    additionalRiskInformationPage.checkErrorsAndSubmit()

    // Then the task is complete on the task list
    taskListPage.checkOnPage()
    taskListPage.shouldShowTaskStatus('risks-of-serious-harm-to-others', 'Completed')
  })
})
