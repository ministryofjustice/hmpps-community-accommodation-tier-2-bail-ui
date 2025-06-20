import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class CommunicationAndLanguagePage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Add communication and language needs details for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'communication-and-language',
    )
    pageIsActiveInNavigation('Communication and language')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'communication-and-language',
      }),
    )
  }

  specifyInterpretationNeeds = (): void => {
    this.checkRadioByNameAndValue('requiresInterpreter', 'yes')
    this.getTextInputByIdAndEnterDetails('interpretationDetail', 'Welsh')
  }

  describeImpairments = (): void => {
    this.checkRadioByNameAndValue('hasImpairments', 'yes')
    this.getTextInputByIdAndEnterDetails('impairmentsDetail', 'Struggles with written comprehension')
  }
}
