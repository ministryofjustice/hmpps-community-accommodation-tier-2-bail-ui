import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'

export default class SeriousHarmRiskLevelsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      'Confirm the current risk levels as discussed with the CPP',
      application,
      'add-probation-supervision-details',
      'serious-harm-risk-levels',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'add-probation-supervision-details',
        page: 'serious-harm-risk-levels',
      }),
    )
  }

  selectRiskLevels() {
    this.checkRadioByNameAndValue('riskToChildren', 'low')
    this.checkRadioByNameAndValue('riskToPublic', 'medium')
    this.checkRadioByNameAndValue('riskToKnownAdults', 'high')
    this.checkRadioByNameAndValue('riskToStaff', 'veryHigh')
    this.checkRadioByNameAndValue('overallRiskLevel', 'high')
  }
}
