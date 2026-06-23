import { Cas2Application as Application } from '../../../../../server/@types/shared/models/Cas2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class CPPDetailsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Who is ${nameOrPlaceholderCopy(application.person)}'s Community Probation Practitioner (CPP)?`,
      application,
      'add-probation-supervision-details',
      'community-probation-practitioner-details',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'add-probation-supervision-details',
        page: 'community-probation-practitioner-details',
      }),
    )
  }

  checkErrors() {
    this.shouldShowErrorSummary("Enter the CPP's full name")
    this.shouldShowErrorSummary('Enter the probation region')
    this.shouldShowErrorSummary("Enter the CPP's email address")
    this.shouldShowErrorSummary("Enter the CPP's contact number")
  }

  completeForm(): void {
    this.getTextInputByIdAndEnterDetails('name', 'Marsha Crist')
    this.getTextInputByIdAndEnterDetails('probationRegion', 'Tameside')
    this.getTextInputByIdAndEnterDetails('email', 'marsha@probation.gov.uk')
    this.getTextInputByIdAndEnterDetails('telephone', '11111111111')
  }
}
