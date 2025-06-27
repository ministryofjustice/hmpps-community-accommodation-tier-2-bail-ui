import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class LearningDifficultiesDetailsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Add learning difficulties and neurodiversity needs details for ${nameOrPlaceholderCopy(application.person)}`,
      application,
      'health-needs',
      'learning-difficulties-details',
    )

    pageIsActiveInNavigation('Learning difficulties')
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'learning-difficulties-details',
      }),
    )
  }

  describeNeeds = (): void => {
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
