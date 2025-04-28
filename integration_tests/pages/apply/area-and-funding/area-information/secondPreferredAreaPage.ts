import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { pageIsActiveInNavigation } from '../../../utils'

export default class SecondPreferredAreaPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Second preferred area for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'area-information',
      'second-preferred-area',
    )
    pageIsActiveInNavigation('Second preferred area')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'area-information',
        page: 'second-preferred-area',
      }),
    )
  }

  completePage() {
    this.getTextInputByIdAndEnterDetails('preferredArea', 'London')
    this.getTextInputByIdAndEnterDetails('preferenceReason', 'Preference reason')
    this.clickSubmit()
  }
}
