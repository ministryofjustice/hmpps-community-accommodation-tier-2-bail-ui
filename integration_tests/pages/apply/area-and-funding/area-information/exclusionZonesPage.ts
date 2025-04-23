import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { pageIsActiveInNavigation } from '../../../utils'

export default class ExclusionZonesPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Exclusion zones for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'area-information',
      'exclusion-zones',
    )

    pageIsActiveInNavigation('Exclusion zones')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'area-information',
        page: 'exclusion-zones',
      }),
    )
  }

  completePage() {
    this.checkRadioByNameAndValue('hasExclusionZones', 'yes')
    this.getTextInputByIdAndEnterDetails('exclusionZonesDetail', 'Details about exclusion zones')
    this.clickSubmit()
  }
}
