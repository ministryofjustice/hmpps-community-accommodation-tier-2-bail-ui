import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import { pageIsActiveInNavigation } from '../../../utils'

export default class GangAffiliationsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Does ${nameOrPlaceholderCopy(application.person)} have any gang affiliations?`,
      application,
      'area-information',
      'gang-affiliations',
    )
    pageIsActiveInNavigation('Gang affiliations')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'area-information',
        page: 'gang-affiliations',
      }),
    )
  }

  completePage() {
    this.checkRadioByNameAndValue('hasGangAffiliations', 'yes')
    this.getTextInputByIdAndEnterDetails('gangName', 'Name of gang')
    this.getTextInputByIdAndEnterDetails('gangOperationArea', 'North East')
    this.getTextInputByIdAndEnterDetails('rivalGangDetail', 'Rival gang detail')
    this.clickSubmit()
  }
}
