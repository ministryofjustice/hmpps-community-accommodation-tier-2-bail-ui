import { Cas2Application as Application, FullPerson } from '@approved-premises/api'
import Page from '../page'
import Apply from '../../../server/form-pages/apply'
import paths from '../../../server/paths/apply'

export default class TaskListPage extends Page {
  constructor(application: Application, personName: string) {
    super(`Apply for CAS2${application.applicationOrigin !== 'other' ? ' for Bail' : ''}`, personName)
  }

  static visit(application: Application): TaskListPage {
    cy.visit(paths.applications.show({ id: application.id }))

    const person = application.person as FullPerson

    return new TaskListPage(application, person.name)
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

  shouldNotShowTask = (taskTitle): void => {
    cy.get('[data-cy-task-name]').should('not.contain', taskTitle)
  }

  shouldShowSections = (sectionTitles: Array<string>): void => {
    cy.get('[data-cy-section-title]').then($titles => {
      const list = Array.from($titles, title => title.textContent.trim())
      expect(JSON.stringify(list)).to.equal(JSON.stringify(sectionTitles))
    })
  }
}
