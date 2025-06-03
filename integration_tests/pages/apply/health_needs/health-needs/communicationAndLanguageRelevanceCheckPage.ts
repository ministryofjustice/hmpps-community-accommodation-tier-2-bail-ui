import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class CommunicationAndLanguageRelevanceCheckPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Does ${nameOrPlaceholderCopy(application.person)} have any communication and language needs?`,
      application,
      'health-needs',
      'communication-and-language-relevance-check',
    )
    pageIsActiveInNavigation('Communication and language')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'communication-and-language-relevance-check',
      }),
    )
  }

  selectApplicantDoesHaveCommunicationAndLanguageNeeds(): void {
    this.checkRadioByNameAndValue('hasCommunicationAndLanguageNeeds', 'yes')
  }

  selectApplicantDoesNotHaveCommunicationAndLanguageNeeds(): void {
    this.checkRadioByNameAndValue('hasCommunicationAndLanguageNeeds', 'no')
  }
}
