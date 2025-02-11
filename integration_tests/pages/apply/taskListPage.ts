import { Cas2v2Application as Application } from '@approved-premises/api'
import Page from '../page'
import Apply from '../../../server/form-pages/apply'
import paths from '../../../server/paths/apply'
import { FullPerson } from '../../../server/@types/shared/models/FullPerson'

export default class TaskListPage extends Page {
  constructor(name: string) {
    super('Apply for Short-Term Accommodation (CAS-2)', name)
  }

  static visit(application: Application): TaskListPage {
    cy.visit(paths.applications.show({ id: application.id }))

    const person = application.person as FullPerson

    return new TaskListPage(person.name)
  }

  shouldShowTasksWithinTheirSections = (): void => {
    Apply.sections.forEach(section => {
      cy.get(`[data-section_name="${section.title}"]`).within(() => {
        // And I see the expected SECTION
        cy.get('[data-cy-section-title]').contains(section.title)

        // And I see each expected TASK
        section.tasks.forEach(task => {
          if (task.id === 'check-your-answers') {
            cy.get('div').contains('Check application answers')
          } else {
            cy.get('[data-cy-task-name]').contains(task.title)
          }
        })
      })
    })
  }

  shouldShowTaskStatus = (task: string, status: string): void => {
    cy.get(`#${task}-status`).should('contain', status)
  }

  visitTask = (taskTitle: string): void => {
    cy.get('[data-cy-task-name]').contains(taskTitle).click()
  }
}
