import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class UnspentConvictionsDataPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Add previous unspent convictions for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'previous-unspent-convictions',
      'unspent-convictions-data',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'previous-unspent-convictions',
        page: 'unspent-convictions-data',
      }),
    )
  }

  completeForm(): void {
    this.getSelectInputByIdAndSelectAnEntry('convictionType', 'Arson')
    this.getTextInputByIdAndEnterDetails('numberOfConvictions', '4')
    this.checkRadioByNameAndValue('currentlyServing', 'yes')
    this.checkRadioByNameAndValue('safeguarding', 'yes')
    this.getTextInputByIdAndEnterDetails('safeguardingDetail', 'detail')
  }
}
