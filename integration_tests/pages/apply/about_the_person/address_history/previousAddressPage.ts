import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import paths from '../../../../../server/paths/apply'

export default class PreviousAddressPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Did ${nameOrPlaceholderCopy(application.person)} have a fixed address before being arrested?`,
      application,
      'address-history',
      'previous-address',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'address-history',
        page: 'previous-address',
      }),
    )
  }

  completePreviousAddressDetails(): void {
    this.checkRadioByNameAndValue('hasPreviousAddress', 'yes')
    this.getTextInputByIdAndEnterDetails('previousAddress', '1 Example Road')
  }

  completeLatestLivingSituationDetails(): void {
    this.checkRadioByNameAndValue('latestLivingSituation', 'other')
    this.getTextInputByIdAndEnterDetails('otherLivingSituation', 'an unusual arrangement')
  }
}
