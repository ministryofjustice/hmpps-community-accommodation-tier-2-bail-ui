import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'

export default class OASysRiskAssessmentPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      'Has an OASys risk assessment been done in the last two years?',
      application,
      'add-probation-supervision-details',
      'oasys-risk-assessment',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'add-probation-supervision-details',
        page: 'oasys-risk-assessment',
      }),
    )
  }

  selectYesToRiskAssessmentDone(): void {
    this.checkRadioByNameAndValue('riskAssessment', 'yes')
  }

  selectNoToRiskAssessmentDone(): void {
    this.checkRadioByNameAndValue('riskAssessment', 'no')
  }

  selectYesToOASysHasBeenUpdated(): void {
    this.checkRadioByNameAndValue('oasysHasBeenUpdated', 'yes')
  }

  selectNoToOASysHasBeenUpdated(): void {
    this.checkRadioByNameAndValue('oasysHasBeenUpdated', 'no')
  }
}
