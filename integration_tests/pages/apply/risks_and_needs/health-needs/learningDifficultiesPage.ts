import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class LearningDifficultiesPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Learning difficulties and neurodiversity needs details for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'learning-difficulties',
    )

    pageIsActiveInNavigation('Learning difficulties')
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

  describeNeeds = (): void => {
    this.checkRadioByNameAndValue('hasLearningNeeds', 'yes')
    this.getTextInputByIdAndEnterDetails('learningNeedsDetail', 'Has ADHD')
  }

  describeSupportNeeds = (): void => {
    this.checkRadioByNameAndValue('needsSupport', 'yes')
    this.getTextInputByIdAndEnterDetails('supportDetail', 'Details of support')
  }

  describeTreatment = (): void => {
    this.checkRadioByNameAndValue('receivesTreatment', 'yes')
    this.getTextInputByIdAndEnterDetails('treatmentDetail', 'treatment details')
  }

  describeVulnerability = (): void => {
    this.checkRadioByNameAndValue('isVulnerable', 'yes')
    this.getTextInputByIdAndEnterDetails('vulnerabilityDetail', 'Medium: is prone to risky behaviour')
  }
}
