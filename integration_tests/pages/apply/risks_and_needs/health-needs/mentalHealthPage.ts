import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class MentalHealthPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Mental health needs details for ${nameOrPlaceholderCopy(application.person)}`,
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
  }

  describeSupportNeeds = (): void => {
    this.checkRadioByNameAndValue('hasSupportNeeds', 'yes')
    this.getTextInputByIdAndEnterDetails('supportNeedsDetail', 'some support needs details')
  }

  describeTreatment = (): void => {
    this.checkRadioByNameAndValue('receivesTreatment', 'yes')
    this.getTextInputByIdAndEnterDetails('treatmentDetail', 'some treatment details')
  }

  enterServiceDetails = (): void => {
    this.checkRadioByNameAndValue('isEngagedWithService', 'yes')
    this.getTextInputByIdAndEnterDetails('serviceDetail', 'a service')
  }

  confirmSupportReferral = (): void => {
    this.checkRadioByNameAndValue('willReferralBeMade', 'yes')
  }

  describeCurrentPresentation = (): void => {
    this.getTextInputByIdAndEnterDetails('needsPresentation', 'some presentation details')
  }
}
