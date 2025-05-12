import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class SelfHarmPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Concerns of self-harm and suicide for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'risk-information',
      'self-harm',
    )

    pageIsActiveInNavigation('Self-harm and suicide')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-information',
        page: 'self-harm',
      }),
    )
  }

  describePastHarm(): void {
    this.checkRadioByNameAndValue('pastHarm', 'yes')
    this.getTextInputByIdAndEnterDetails('pastHarmDetail', 'Has a history of self-harm')
  }

  describeCurrentConcerns(): void {
    this.checkRadioByNameAndValue('currentConcerns', 'yes')
    this.getTextInputByIdAndEnterDetails('currentConcernsDetail', 'Description of current concerns')
  }

  describeSpecificTriggers(): void {
    this.checkRadioByNameAndValue('specificTriggers', 'yes')
    this.getTextInputByIdAndEnterDetails('specificTriggersDetail', 'Description of triggers')
  }

  describeCurrentlyPresenting(): void {
    this.getTextInputByIdAndEnterDetails(
      'currentlyPresenting',
      'Description of how the applicant is currently presenting',
    )
  }
}
