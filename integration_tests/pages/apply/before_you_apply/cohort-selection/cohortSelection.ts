import { Cas2v2Application as Application, FullPerson } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import ApplyPage from '../../applyPage'
import { cohortSelectionAnswers } from '../../../../../server/utils/applications/cohortLabels'

export default class CohortSelectionPage extends ApplyPage {
  constructor(application: Application) {
    super(
      `Why does ${(application.person as FullPerson).name} need CAS2 accommodation?`,
      application,
      'cohort-selection',
      'cohort-selection',
    )
  }

  static visit = (application: Application) => {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'cohort-selection',
        page: 'cohort-selection',
      }),
    )
    return new CohortSelectionPage(application)
  }

  verifyQuestions() {
    Object.values(cohortSelectionAnswers).forEach(question => {
      cy.contains(question)
    })
    cy.contains('Provide details (optional)')
  }
}
