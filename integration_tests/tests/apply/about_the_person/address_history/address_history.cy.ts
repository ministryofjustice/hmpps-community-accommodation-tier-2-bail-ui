import Page from '../../../../pages/page'
import { personFactory, applicationFactory } from '../../../../../server/testutils/factories'
import HasFixedAddressBeforeCustodyPage from '../../../../pages/apply/about_the_person/address_history/hasFixedAddressBeforeCustodyPage'
import LastFixedAddressPage, {
  lastFixedAddressDetails,
} from '../../../../pages/apply/about_the_person/address_history/lastFixedAddressPage'
import NoFixedAddressPage, {
  noFixedAddressDetails,
} from '../../../../pages/apply/about_the_person/address_history/noFixedAddressPage'
import TaskListPage from '../../../../pages/apply/taskListPage'

context('Complete the "Address history" task', () => {
  const person = personFactory.build({ name: 'Roger Smith' })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')

    cy.fixture('applicationData.json').then(applicationData => {
      delete applicationData['address-history']
      cy.wrap(applicationData).as('applicationData')
    })
  })

  beforeEach(() => {
    //  Given I am logged in
    cy.signIn()
  })

  it('runs the address history task when the person had a fixed address before custody', function test() {
    const application = applicationFactory.build({
      person,
      data: this.applicationData,
    })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the 'has fixed address before custody' page
    HasFixedAddressBeforeCustodyPage.visit(application)
    const hasFixedAddressPage = Page.verifyOnPage(HasFixedAddressBeforeCustodyPage, application)

    // When I submit without selecting an answer
    hasFixedAddressPage.clickSubmit()

    // Then I see the mandatory field error
    hasFixedAddressPage.checkErrors()

    // When I select 'yes' and submit
    hasFixedAddressPage.completeForm('yes')
    hasFixedAddressPage.clickSubmit()
    cy.task('stubApplicationGetFromLastUpdate', { application })
    cy.reload()

    // Then I am on the 'last fixed address' page
    const lastFixedAddressPage = Page.verifyOnPage(LastFixedAddressPage, application)

    // When I complete the form and submit
    lastFixedAddressPage.checkErrorsAndSubmit()

    // Then I am on the task list
    const taskListPage = Page.verifyOnPage(TaskListPage, application)
    taskListPage.shouldShowTaskStatus('address-history', 'Completed')

    // And the answers I entered have been saved to the application
    cy.task('verifyApplicationUpdate', application.id).then(requests => {
      expect(
        JSON.parse(requests[0].body).data['address-history']['has-fixed-address-before-custody']
          .hasFixedAddressBeforeCustody,
      ).eq('yes')

      const lastFixedAddress = JSON.parse(requests[1].body).data['address-history']['last-fixed-address']
      expect(lastFixedAddress.addressLine1).eq(lastFixedAddressDetails.addressLine1)
      expect(lastFixedAddress.addressLine2).eq(lastFixedAddressDetails.addressLine2)
      expect(lastFixedAddress.townOrCity).eq(lastFixedAddressDetails.townOrCity)
      expect(lastFixedAddress.county).eq(lastFixedAddressDetails.county)
      expect(lastFixedAddress.postcode).eq(lastFixedAddressDetails.postcode)
    })

    // When I return to the 'last fixed address' page
    LastFixedAddressPage.visit(application)

    // Then my previously entered address is still shown
    lastFixedAddressPage.shouldShowEnteredDetails()

    // And I can click back through the whole task
    lastFixedAddressPage.clickBack()
    hasFixedAddressPage.shouldShowSelectedAnswer('yes')
    hasFixedAddressPage.clickBack()

    // And I see the task list
    Page.verifyOnPage(TaskListPage, application)
  })

  it('runs the address history task when the person had no fixed address before custody', function test() {
    const application = applicationFactory.build({
      person,
      data: this.applicationData,
    })

    cy.task('stubApplicationGet', { application })
    cy.task('stubApplicationUpdate', { application })

    // Given I am on the 'has fixed address before custody' page
    HasFixedAddressBeforeCustodyPage.visit(application)
    const hasFixedAddressPage = Page.verifyOnPage(HasFixedAddressBeforeCustodyPage, application)

    // When I select 'no' and submit
    hasFixedAddressPage.completeForm('no')
    hasFixedAddressPage.clickSubmit()
    cy.task('stubApplicationGetFromLastUpdate', { application })
    cy.reload()

    // Then I am on the 'no fixed address' page
    const noFixedAddressPage = Page.verifyOnPage(NoFixedAddressPage, application)

    // When I complete the form and submit
    noFixedAddressPage.checkErrorsAndSubmit()

    // Then I am on the task list
    const taskListPage = Page.verifyOnPage(TaskListPage, application)
    taskListPage.shouldShowTaskStatus('address-history', 'Completed')

    // And the answers I entered have been saved to the application
    cy.task('verifyApplicationUpdate', application.id).then(requests => {
      expect(
        JSON.parse(requests[0].body).data['address-history']['has-fixed-address-before-custody']
          .hasFixedAddressBeforeCustody,
      ).eq('no')

      const noFixedAddress = JSON.parse(requests[1].body).data['address-history']['no-fixed-address']
      expect(noFixedAddress.howLong).eq(noFixedAddressDetails.howLong)
      expect(noFixedAddress.lastKnownAddressLine1).eq(noFixedAddressDetails.lastKnownAddressLine1)
      expect(noFixedAddress.lastKnownTownOrCity).eq(noFixedAddressDetails.lastKnownTownOrCity)
      expect(noFixedAddress.lastKnownPostcode).eq(noFixedAddressDetails.lastKnownPostcode)
    })

    // When I return to the 'no fixed address' page
    NoFixedAddressPage.visit(application)

    // Then my previously entered details are still shown
    noFixedAddressPage.shouldShowEnteredDetails()

    // And I can click back through the whole task
    noFixedAddressPage.clickBack()
    hasFixedAddressPage.shouldShowSelectedAnswer('no')
    hasFixedAddressPage.clickBack()

    // And I see the task list
    Page.verifyOnPage(TaskListPage, application)
  })
})
