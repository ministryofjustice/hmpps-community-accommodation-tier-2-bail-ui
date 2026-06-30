import { Cas2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class PhysicalHealthPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Physical and mobility needs details for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'physical-health',
    )
    pageIsActiveInNavigation('Physical health')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'physical-health',
      }),
    )
  }

  describePhysicalNeeds = (): void => {
    this.checkRadioByNameAndValue('hasPhyHealthNeeds', 'yes')
    this.getTextInputByIdAndEnterDetails('needsDetail', 'Has mobility problems')
  }

  describeSupportNeeded = (): void => {
    this.checkRadioByNameAndValue('requiresSupport', 'yes')
    this.getTextInputByIdAndEnterDetails('supportDetail', 'Needs support with cooking and nutrition')
  }

  confirmCanClimbStairs = (): void => {
    this.checkRadioByNameAndValue('canClimbStairs', 'no')
  }

  provideIndependentLivingInfo = (): void => {
    this.checkRadioByNameAndValue('canLiveIndependently', 'no')
    this.getTextInputByIdAndEnterDetails('indyLivingDetail', 'Needs help with bathing')
  }

  checkErrors() {
    this.shouldShowErrorSummary('Select if they have any physical and mobility needs')
    this.shouldShowErrorSummary('Select if they need any support')
    this.shouldShowErrorSummary('Select if they can climb stairs')
    this.shouldShowErrorSummary('Select if they can live independently')
  }

  completeForm(): void {
    this.describePhysicalNeeds()
    this.describeSupportNeeded()
    this.confirmCanClimbStairs()
    this.provideIndependentLivingInfo()
  }
}
