import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class BrainInjuryPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Does ${nameOrPlaceholderCopy(application.person)} have a brain injury?`,
      application,
      'health-needs',
      'brain-injury',
    )

    pageIsActiveInNavigation('Brain injury')
    this.pageHasBrainInjuryGuidance()
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'health-needs',
        page: 'brain-injury',
      }),
    )
  }

  pageHasBrainInjuryGuidance = (): void => {
    cy.get('p').contains('This could be as a result of an accident')
    cy.get('[data-testid="brain-injury-guidance"]').should('be.visible')
  }

  confirmBrainInjury = (): void => {
    this.checkRadioByNameAndValue('hasBrainInjury', 'yes')
  }

  confirmNoBrainInjury = (): void => {
    this.checkRadioByNameAndValue('hasBrainInjury', 'no')
  }
}
