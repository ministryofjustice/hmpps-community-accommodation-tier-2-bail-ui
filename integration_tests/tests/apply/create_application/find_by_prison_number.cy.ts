//  Feature: Referrer without correct roles enters prisonn number
//    As a referrer without the correct roles set
//    I want to be shown an unauthorised screen
//    So that I know that I cannot proceed
//
//  Scenario: choose prison bail and continue to the unauthorised page
//    Given I'm on application origin page
//    When I choose prison bail
//    And I click confirm
//    Then I'm on the unauthorised page
//
//  Feature: Referrer enters prison number of applicant to begin application process
//    So that I can create an application
//    As a referrer
//    I want to enter the prison number of the applicant and see that the correct person is returned
//
//  Scenario: follow link from 'Before you start' page
//    Given I'm on the 'Before you start' page
//    And I click the link to start a new application
//    Then I'm on the application origin page
//
//  Scenario: choose prison bail and continue to the enter a prison number page
//    Given I'm on application origin page
//    When I choose prison bail
//    And I click confirm
//    Then I'm on the enter a prison number page
//
//  Scenario: enter a prison number and continue to the 'Confirm applicant details' section without seeing the task list
//    Given I'm on the enter prison number page
//    When I enter an existing prison number
//    And I click save and continue
//    Then I'm on the first task of the 'Confirm applicant details' section
//
//  Scenario: answer is enforced
//    Given I'm on the enter prison number page
//    When I click continue without entering a prison number
//    Then I that an answer is required
//
//  Scenario: enter a prison number that can't be found
//    Given I'm on the enter prison number page
//    When I enter a prison number that can't be found
//    Then I see a not found error message
//
//  Scenario: enter a prison number for a person I'm not authorised to view
//    Given I'm on the enter prison number page
//    When I enter a prison number for a person I'm not authorised to view
//    Then I see an unathorised error message

import ConfirmApplicantPage from '../../../pages/apply/confirmApplicantPage'
import { personFactory, applicationFactory } from '../../../../server/testutils/factories/index'
import Page from '../../../pages/page'
import FindByPrisonNumberPage from '../../../pages/apply/findByPrisonNumberPage'
import BeforeYouStartPage from '../../../pages/apply/beforeYouStartPage'
import ApplicationOriginPage from '../../../pages/apply/applicationOriginPage'
import UnauthorisedPrisonBailPage from '../../../pages/apply/unauthorisedPrisonBailPage'

context('Find by prison number without correct roles', () => {
  const person = personFactory.build({ name: 'Roger Smith', nomsNumber: '123' })
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
  it('start new application button takes me to the enter a prison number page', () => {
    // I'm on the 'Before you start' page
    BeforeYouStartPage.visit(person.name)

    // I click the link to start a new application
    cy.get('a').contains('Start now').click()

    // I'm on the application origin page
    Page.verifyOnPage(ApplicationOriginPage)
  })

  //  Scenario: choose prison bail and continue to the unauthorised page
  // ----------------------------------------------
  it('Continues to unauthorised page after selecting prison bail application origin', () => {
    // I'm on the application origin page
    const page = ApplicationOriginPage.visit(person.name)

    // When I choose prison bail
    page.checkRadioByNameAndValue('applicationOrigin', 'prisonBail')

    // And I click confirm
    page.clickSubmit('Confirm')

    // Then I'm on the unauthorised prison bail page
    Page.verifyOnPage(UnauthorisedPrisonBailPage)
  })
})

context('Find by prison number', () => {
  const person = personFactory.build({ name: 'Roger Smith', nomsNumber: '123' })
  const applications = applicationFactory.buildList(3)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_CAS2_PRISON_BAIL_REFERRER'] })
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
  it('start new application button takes me to the enter prison number page', () => {
    // I'm on the 'Before you start' page
    BeforeYouStartPage.visit(person.name)

    // I click the link to start a new application
    cy.get('a').contains('Start now').click()

    // I'm on the application origin page
    Page.verifyOnPage(ApplicationOriginPage)
  })

  //  Scenario: choose prison bail and continue to the enter a prison number page
  // ----------------------------------------------
  it('Continues to enter a prison number page after selecting prison bail application origin', () => {
    // I'm on the application origin page
    const page = ApplicationOriginPage.visit(person.name)

    // When I choose prison bail
    page.checkRadioByNameAndValue('applicationOrigin', 'prisonBail')

    // And I click confirm
    page.clickSubmit('Confirm')

    // Then I'm on the enter a prison number page
    Page.verifyOnPage(FindByPrisonNumberPage)
  })

  //  Scenario: enter a prison number and continue to 'Confirm applicant details' section without seeing the task list
  // ----------------------------------------------
  it('Continues to "Confirm applicant details" section (before task list)', () => {
    // I'm on the enter prison number page
    const page = FindByPrisonNumberPage.visit(person.name)

    // I enter an existing prison number
    page.getTextInputByIdAndEnterDetails('prisonNumber', person.nomsNumber)
    cy.task('stubFindPersonByPrisonNumber', { person })
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
  it('enforces an answer', () => {
    // I'm on the enter prison number page
    const page = FindByPrisonNumberPage.visit(person.name)

    // I click continue without entering a prison number
    page.clickSubmit('Search for applicant')

    // Then I see an error message
    cy.get('.govuk-error-summary').should('contain', `Enter a prison number`)
    cy.get(`[data-cy-error-prisonNumber]`).should('contain', `Enter a prison number`)
  })

  //  Scenario: enter a prison number that can't be found
  // ----------------------------------------------
  it('renders with a prison number not found error', () => {
    // I'm on the enter prison number page
    const page = FindByPrisonNumberPage.visit(person.name)

    // I enter a prison number that can't be found
    page.getTextInputByIdAndEnterDetails('prisonNumber', person.nomsNumber)
    cy.task('stubPersonByPrisonNumberNotFound', { person })
    page.clickSubmit('Search for applicant')

    // I see a not found error message
    cy.get('.govuk-error-summary').should(
      'contain',
      `No person found for prison number ${person.nomsNumber}. You can try again, or search using a different prison number or a case reference number (CRN)`,
    )
    cy.get(`[data-cy-error-prisonNumber]`).should(
      'contain',
      `No person found for prison number ${person.nomsNumber}. You can try again, or search using a different prison number or a case reference number (CRN)`,
    )
  })

  //  Scenario: enter a prison number for a person I'm not authorised to view
  // ----------------------------------------------
  it('renders with an unauthorised error', () => {
    cy.task('stubFindPersonByPrisonNumberForbidden', {
      person,
    })

    // I'm on the enter prison number page
    const page = FindByPrisonNumberPage.visit(person.name)

    // I enter a prison number that can't be found

    cy.get('#prisonNumber').type(person.nomsNumber)
    page.clickSubmit('Search for applicant')

    // I see an unathorised error message
    cy.get('.govuk-error-summary').should(
      'contain',
      `You do not have permission to access the prison number ${person.nomsNumber}, please try another number.`,
    )
    cy.get(`[data-cy-error-prisonNumber]`).should(
      'contain',
      `You do not have permission to access the prison number ${person.nomsNumber}, please try another number.`,
    )
  })
})
