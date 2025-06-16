import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'

export default class AnyPreviousConvictionsPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Check any previous unspent convictions`,
      application,
      'previous-unspent-convictions',
      'any-previous-convictions',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'previous-unspent-convictions',
        page: 'any-previous-convictions',
      }),
    )
  }

  selectHasAnyPreviousConvictions(): void {
    this.checkRadioByNameAndValue('hasAnyPreviousConvictions', 'yesRelevantRisk')
  }

  hasGuidance(): void {
    cy.get('li').contains('active community orders or sentence')
    cy.get('strong').contains('Spent convictions are protected by law and should not be disclosed')
    cy.get('h2').contains('Add any unspent convictions that meet one or more of the following criteria')
    cy.get('h2').contains('Do not add any')
    cy.get('span').contains('See an example of what convictions to add')
  }
}
