import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation, pageHasLinkToGuidance } from '../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class LearningDifficultiesPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Learning difficulties and neurodiversity for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'learning-difficulties',
    )

    pageIsActiveInNavigation('Learning difficulties')
    pageHasLinkToGuidance()
    this.pageHasNeurodiversityGuidance()
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

  pageHasNeurodiversityGuidance = (): void => {
    cy.get('.guidance').contains('Neurodiversity covers Autism,')
    cy.get('.guidance').contains('This can overlap with learning difficulties')
  }

  describeAdditionalNeeds = (): void => {
    this.checkRadioByNameAndValue('hasLearningNeeds', 'yes')
    this.getTextInputByIdAndEnterDetails('needsDetail', 'Has ADHD')
  }

  describeVulnerability = (): void => {
    this.checkRadioByNameAndValue('isVulnerable', 'yes')
    this.getTextInputByIdAndEnterDetails('vulnerabilityDetail', 'Medium: is prone to risky behaviour')
  }

  describeDifficultiesInteracting = (): void => {
    this.checkRadioByNameAndValue('hasDifficultyInteracting', 'yes')
    this.getTextInputByIdAndEnterDetails('interactionDetail', 'Can be withdrawn')
  }

  describeAdditionalSupportNeeded = (): void => {
    this.checkRadioByNameAndValue('requiresAdditionalSupport', 'yes')
    this.getTextInputByIdAndEnterDetails('addSupportDetail', 'Requires daily support')
  }
}
