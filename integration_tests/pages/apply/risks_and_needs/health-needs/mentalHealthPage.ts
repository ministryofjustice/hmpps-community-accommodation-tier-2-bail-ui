import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation, fieldIsOptional } from '../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class MentalHealthPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Mental health needs for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'mental-health',
    )
    pageIsActiveInNavigation('Mental health')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'mental-health',
      }),
    )
  }

  describeNeeds = (): void => {
    this.checkRadioByNameAndValue('hasMentalHealthNeeds', 'yes')
    this.getTextInputByIdAndEnterDetails('needsDetail', 'Has depression')
    this.getTextInputByIdAndEnterDetails('needsPresentation', 'Erratic behaviour')
  }

  describeEngagement = (): void => {
    this.checkRadioByNameAndValue('isEngagedWithCommunity', 'yes')
    this.getTextInputByIdAndEnterDetails('servicesDetail', 'Attend the The Well Clinic')
    this.checkRadioByNameAndValue('isEngagedWithServicesInCustody', 'yes')
    this.checkRadioByNameAndValue('areIntendingToEngageWithServicesAfterCustody', 'yes')
  }

  describeMedication = (): void => {
    this.checkRadioByNameAndValue('canManageMedication', 'no')
    this.getTextInputByIdAndEnterDetails('medicationIssues', 'Sometimes fails to take pills')
    fieldIsOptional('cantManageMedicationNotes')
    this.getTextInputByIdAndEnterDetails('cantManageMedicationNotes', 'struggles because x, y and z')
  }
}
