import { Cas2Application as Application } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import ApplyPage from '../../applyPage'

export default class BackupContactDetailsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super('Backup contact details', application, 'referrer-details', 'backup-contact-details')
  }

  static visit = (application: Application) => {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'referrer-details',
        page: 'backup-contact-details',
      }),
    )
  }

  checkErrors() {
    this.shouldShowErrorSummary("Enter the backup contact's full name")
    this.shouldShowErrorSummary("Enter the backup contact's email address")
    this.shouldShowErrorSummary("Enter the backup contact's contact number")
  }

  completeForm(): void {
    this.getTextInputByIdAndEnterDetails('name', 'Ashley Backup')
    this.getTextInputByIdAndEnterDetails('email', 'a.backup@moj.gov.uk')
    this.getTextInputByIdAndEnterDetails('telephone', '1234567')
  }
}
