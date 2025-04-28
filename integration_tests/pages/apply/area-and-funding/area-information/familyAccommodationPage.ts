import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { pageIsActiveInNavigation } from '../../../utils'

export default class FamilyAccommodationPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Family accommodation for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'area-information',
      'family-accommodation',
    )
    pageIsActiveInNavigation('Family accommodation')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'area-information',
        page: 'family-accommodation',
      }),
    )
  }

  completePage() {
    this.checkRadioByNameAndValue('familyProperty', 'yes')
    this.clickSubmit()
  }
}
