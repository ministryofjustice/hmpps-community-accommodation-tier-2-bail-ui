import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class SupervisedByProbationPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Is ${nameOrPlaceholderCopy(application.person)} currently supervised by probation?`,
      application,
      'add-probation-supervision-details',
      'supervised-by-probation',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'add-probation-supervision-details',
        page: 'supervised-by-probation',
      }),
    )
  }

  selectYes(): void {
    this.checkRadioByNameAndValue('probationSupervision', 'yes')
  }

  selectNo(): void {
    this.checkRadioByNameAndValue('probationSupervision', 'no')
  }
}
