//  Feature: Referrer without correct roles enters CRN
//    As a referrer without the correct roles set
//    I want to be shown an unauthorised screen
//    So that I know that I cannot proceed
//
//  Scenario: choose court bail and continue to the unauthorised page
//    Given I'm on application origin page
//    When I choose court bail
//    And I click confirm
//    Then I'm on the unauthorised page
//
//  Feature: Referrer enters CRN of applicant to begin application process
//    As a referrer
//    I want to enter the CRN of the applicant and see that the correct person is returned
//    So that I can create an application
//
//  Scenario: follow link from 'Before you start' page
//    Given I'm on the 'Before you start' page
//    And I click the link to start a new application
//    Then I'm on the application origin page
//
//  Scenario: choose court bail and continue to the enter a CRN page
//    Given I'm on application origin page
//    When I choose court bail
//    And I click confirm
//    Then I'm on the enter a CRN page
//
//  Scenario: enter a CRN and continue to the 'Confirm applicant details' section without seeing the task list
//    Given I'm on the enter CRN page
//    When I enter an existing CRN
//    And I click save and continue
//    Then I'm on the first task of the 'Confirm applicant details' section
//
//  Scenario: answer is enforced
//    Given I'm on the enter CRN page
//    When I click continue without entering a CRN
//    Then I that an answer is required
//
//  Scenario: enter a CRN that can't be found
//    Given I'm on the enter a CRN page
//    When I enter a CRN that can't be found
//    Then I see a not found error message
//
//  Scenario: enter a CRN for a person I'm not authorised to view
//    Given I'm on the CRN number page
//    When I enter a CRN for a person I'm not authorised to view
//    Then I see an unathorised error message

import ConfirmApplicantPage from '../../../pages/apply/confirmApplicantPage'
import { personFactory, applicationFactory } from '../../../../server/testutils/factories/index'
import Page from '../../../pages/page'
import FindByCrnPage from '../../../pages/apply/findByCrnPage'
import BeforeYouStartPage from '../../../pages/apply/beforeYouStartPage'
import ApplicationOriginPage from '../../../pages/apply/applicationOriginPage'
import UnauthorisedCourtBailPage from '../../../pages/apply/unauthorisedCourtBailPage'

context('Find by CRN without correct roles', () => {
  const person = personFactory.build({ name: 'Roger Smith', crn: '123' })
  const applications = applicationFactory.buildList(3)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
  })

  beforeEach(() => {
    // Given I am logged in
    cy.signIn()

    // and there are existing applications
    cy.task('stubApplications', applications)
  })

  //  Scenario: follow link from 'Before you start' page
  // ----------------------------------------------
  it('start new application button takes me to the enter a CRN page', () => {
    // I'm on the 'Before you start' page
    BeforeYouStartPage.visit(person.name)

    // I click the link to start a new application
    cy.get('a').contains('Start now').click()

    // I'm on the application origin page
    Page.verifyOnPage(ApplicationOriginPage)
  })

  //  Scenario: choose court bail and continue to the unauthorised page
  // ----------------------------------------------
  it('Continues to unauthorised page after selecting court bail application origin', () => {
    // I'm on the application origin page
    const page = ApplicationOriginPage.visit(person.name)

    // When I choose court bail
    page.checkRadioByNameAndValue('applicationOrigin', 'courtBail')

    // And I click confirm
    page.clickSubmit('Confirm')

    // Then I'm on the unauthorised court bail page
    Page.verifyOnPage(UnauthorisedCourtBailPage)
  })
})

context('Find by CRN', () => {
  const person = personFactory.build({ name: 'Roger Smith', crn: '123' })
  const applications = applicationFactory.buildList(3)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_COURT_BAIL_REFERRER'] })
    cy.task('stubAuthUser')
  })

  beforeEach(() => {
    // Given I am logged in
    cy.signIn()

    // and there are existing applications
    cy.task('stubApplications', applications)
  })

  //  Scenario: follow link from 'Before you start' page
  // ----------------------------------------------
  it('start new application button takes me to the enter a CRN page', () => {
    // I'm on the 'Before you start' page
    BeforeYouStartPage.visit(person.name)

    // I click the link to start a new application
    cy.get('a').contains('Start now').click()

    // I'm on the application origin page
    Page.verifyOnPage(ApplicationOriginPage)
  })

  //  Scenario: choose court bail and continue to the enter a CRN page
  // ----------------------------------------------
  it('Continues to enter a CRN page after selecting court bail application origin', () => {
    // I'm on the application origin page
    const page = ApplicationOriginPage.visit(person.name)

    // When I choose prison bail
    page.checkRadioByNameAndValue('applicationOrigin', 'courtBail')

    // And I click confirm
    page.clickSubmit('Confirm')

    // Then I'm on the enter a CRN page
    Page.verifyOnPage(FindByCrnPage)
  })

  //  Scenario: enter a CRN and continue to 'Confirm applicant details' section without seeing the task list
  // ----------------------------------------------
  it('Continues to "Confirm applicant details" section (before task list)', () => {
    // I'm on the enter a CRN page
    const page = FindByCrnPage.visit(person.name)

    // I enter an existing CRN
    page.getTextInputByIdAndEnterDetails('crn', person.crn)
    cy.task('stubFindPersonByCrn', { person })
    const application = applicationFactory.build({
      person,
      data: {
        'confirm-eligibility': {
          'confirm-eligibility': {},
        },
      },
    })

    cy.task('stubCreateApplication', { application })
    cy.task('stubApplicationGet', { application })

    // I click save and continue
    page.clickSubmit('Search for applicant')

    // Then I'm on the 'Confirm applicant details' page
    Page.verifyOnPage(ConfirmApplicantPage, person.name)
  })

  //  Scenario: answer is enforced
  // ----------------------------------------------
  it('enforces an enswer', () => {
    // I'm on the enter a CRN page
    const page = FindByCrnPage.visit(person.name)

    // I click continue without entering a CRN
    page.clickSubmit('Search for applicant')

    // Then I see an error message
    cy.get('.govuk-error-summary').should('contain', `Enter a CRN`)
    cy.get(`[data-cy-error-crn]`).should('contain', `Enter a CRN`)
  })

  //  Scenario: enter a CRN that can't be found
  // ----------------------------------------------
  it('renders with a CRN not found error', () => {
    // I'm on the enter a CRN page
    const page = FindByCrnPage.visit(person.name)

    // I enter a CRN that can't be found
    page.getTextInputByIdAndEnterDetails('crn', person.crn)
    cy.task('stubPersonByCrnNotFound', { person })
    page.clickSubmit('Search for applicant')

    // I see a not found error message
    cy.get('.govuk-error-summary').should(
      'contain',
      `No person found for CRN ${person.crn}, please try another number.`,
    )
    cy.get(`[data-cy-error-crn]`).should('contain', `No person found for CRN ${person.crn}, please try another number.`)
  })

  //  Scenario: enter a CRN for a person I'm not authorised to view
  // ----------------------------------------------
  it('renders with an unauthorised error', () => {
    cy.task('stubFindPersonByCrnForbidden', {
      person,
    })

    // I'm on the enter a CRN page
    const page = FindByCrnPage.visit(person.name)

    // I enter a CRN that can't be found

    cy.get('#crn').type(person.crn)
    page.clickSubmit('Search for applicant')

    // I see an unathorised error message
    cy.get('.govuk-error-summary').should(
      'contain',
      `You do not have permission to access the CRN ${person.crn}, please try another number.`,
    )
    cy.get(`[data-cy-error-crn]`).should(
      'contain',
      `You do not have permission to access the CRN ${person.crn}, please try another number.`,
    )
  })
})
