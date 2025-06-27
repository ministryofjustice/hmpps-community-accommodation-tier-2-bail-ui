import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class LearningDifficultiesPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Does ${nameOrPlaceholderCopy(application.person)} have any learning difficulties or neurodiversity needs?`,
      application,
      'health-needs',
      'learning-difficulties',
    )

    pageIsActiveInNavigation('Learning difficulties and neurodiversity')
    this.pageHasLearningDifficultiesGuidance()
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'learning-difficulties',
      }),
    )
  }

  pageHasLearningDifficultiesGuidance = (): void => {
    cy.get('li').contains('make it hard for applicants to understand or remember information')
    cy.get('[data-testid="learning-difficulties-guidance"]').should('be.visible')
  }

  confirmLearningDifficulties = (): void => {
    this.checkRadioByNameAndValue('hasLearningDifficultiesOrNeurodiversityNeeds', 'yes')
  }

  confirmNoLearningDifficulties = (): void => {
    this.checkRadioByNameAndValue('hasLearningDifficultiesOrNeurodiversityNeeds', 'no')
  }
}
