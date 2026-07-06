import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class OasysImportPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Import ${nameOrPlaceholderCopy(application.person)}'s risk of serious harm (RoSH) data from OASys`,
      application,
      'risks-of-serious-harm-to-others',
      'oasys-import',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risks-of-serious-harm-to-others',
        page: 'oasys-import',
      }),
    )
  }

  shouldShowOasysRecordAvailable = (): void => {
    cy.get('#oasys-info').contains('OASys record available')
    cy.get('button').contains('Import and continue')
  }

  shouldShowNoOasysRecordBanner = (): void => {
    cy.get('.govuk-notification-banner').contains('No OASys record available to import')
  }

  importOasysInformation = (): void => {
    cy.get('button').contains('Import and continue').click()
  }

  continueWithoutOasys = (): void => {
    cy.get('a').contains('Continue').click()
  }
}
