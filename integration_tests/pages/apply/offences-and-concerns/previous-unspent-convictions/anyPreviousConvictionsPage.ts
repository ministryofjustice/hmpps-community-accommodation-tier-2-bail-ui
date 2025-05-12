import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class AnyPreviousConvictionsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Previous unspent convictions for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'previous-unspent-convictions',
      'any-previous-convictions',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'previous-unspent-convictions',
        page: 'any-previous-convictions',
      }),
    )
  }

  selectHasAnyPreviousConvictions(): void {
    this.checkRadioByNameAndValue('hasAnyPreviousConvictions', 'yesRelevantRisk')
  }
}
