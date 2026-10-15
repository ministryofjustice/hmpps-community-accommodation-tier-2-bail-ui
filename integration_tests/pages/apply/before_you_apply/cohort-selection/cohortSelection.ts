import { Cas2Application as Application, FullPerson } from '@approved-premises/api'
import paths from '../../../../../server/paths/apply'
import ApplyPage from '../../applyPage'
import { newCohortHints, newCohortLabels } from '../../../../../server/utils/applications/cohortLabels'

export default class CohortSelectionPage extends ApplyPage {
  constructor(readonly application: Application) {
    super(
      `Why does ${(application.person as FullPerson).name} need CAS2 accommodation?`,
      application,
      'cohort-selection',
      'cohort-selection',
    )
  }

  personName = () => {
    return (this.application.person as FullPerson).name
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
    cy.contains(`Why does ${this.personName()} need CAS2 accommodation?`)
      .siblings('.govuk-form-group')
      .first()
      .within(() => {
        Object.keys(newCohortLabels).forEach(key => {
          const question = newCohortLabels[key]
          const hint = newCohortHints[key]

          cy.contains(question).siblings().contains(hint)
        })
      })
    cy.contains('Provide details (optional)')
  }

  selectCohort(cohort: string) {
    CohortSelectionPage.visit(this.application)
    this.checkRadioByNameAndValue('cohort', cohort)
    this.clickSubmit('Confirm and continue')
    cy.task('stubApplicationGetFromLastUpdate', { application: this.application })
    cy.reload()
  }
}
