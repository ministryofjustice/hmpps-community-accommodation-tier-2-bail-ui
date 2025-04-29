import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'

export default class GangAffiliationsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Gang affiliation details for ${nameOrPlaceholderCopy(application.person)}`,
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

  answerGangAffiliationQuestions(): void {
    this.checkRadioByNameAndValue('hasGangAffiliations', 'yes')
    this.getTextInputByIdAndEnterDetails('gangDetails', 'Gang name')
  }

  answerRivalGangAffiliationQuestions(): void {
    this.checkRadioByNameAndValue('rivalGangsOrCountyLines', 'yes')
    this.getTextInputByIdAndEnterDetails('rivalGangsOrCountyLinesDetail', 'Second gang name')
  }
}
