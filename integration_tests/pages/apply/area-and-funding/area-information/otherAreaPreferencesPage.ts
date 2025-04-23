import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { pageIsActiveInNavigation } from '../../../utils'

export default class OtherAreaPreferencesPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Other area preferences for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'area-information',
      'other-area-preferences',
    )
    pageIsActiveInNavigation('Other area preferences')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'area-information',
        page: 'other-area-preferences',
      }),
    )
  }

  completePage() {
    this.getTextInputByIdAndEnterDetails('preferenceInformation', 'Preference information')
    this.clickSubmit()
  }
}
