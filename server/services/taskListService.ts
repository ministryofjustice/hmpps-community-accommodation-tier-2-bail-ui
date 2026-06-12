import { Cas2v2Application as Application } from '@approved-premises/api'
import { FormSections, TaskStatus, TaskWithStatus, UiTask } from '@approved-premises/ui'
import getTaskStatus from '../form-pages/utils/getTaskStatus'
import Apply from '../form-pages/apply/index'

export default class TaskListService {
  taskStatuses: Record<string, TaskStatus>

  formSections: FormSections

  constructor(application: Application) {
    this.formSections = Apply.sections
    this.taskStatuses = {}

    this.formSections.forEach(section => {
      section.tasks.forEach(task => {
        const status = getTaskStatus(task, application)
        if (status !== 'not_applicable') {
          if (
            task.id === 'check-your-answers' &&
            (Object.values(this.taskStatuses).includes('not_started') ||
              Object.values(this.taskStatuses).includes('in_progress'))
          ) {
            this.taskStatuses[task.id] = 'cannot_start'
          } else {
            this.taskStatuses[task.id] = status
          }
        }
      })
    })
  }

  get completeTaskCount() {
    return Object.values(this.taskStatuses).filter(t => t === 'complete').length
  }

  get sections() {
    return this.formSections.map((s, i) => {
      const tasks = s.tasks.map(t => this.addStatusToTask(t)).filter(Boolean)
      return { sectionNumber: i + 1, title: s.title, tasks }
    })
  }

  get taskCount() {
    return this.formSections.flatMap(s => s.tasks).filter(t => this.taskStatuses[t.id]).length
  }

  get status() {
    const completeTasks = Object.values(this.taskStatuses).filter(t => t === 'complete')
    return completeTasks.length === Object.keys(this.taskStatuses).length ? 'complete' : 'incomplete'
  }

  addStatusToTask(task: UiTask): TaskWithStatus {
    const status = this.taskStatuses[task.id]
    return status ? { ...task, status } : undefined
  }

  get firstIncompleteTask(): string | null {
    for (const [task, status] of Object.entries(this.taskStatuses)) {
      if (status !== 'complete') {
        return task
      }
    }
    return null
  }

  get requiredTasks(): Record<string, Array<TaskStatus>> {
    return {
      'confirm-eligibility': ['not_started', 'in_progress'],
      'confirm-consent': ['not_started'],
      'cohort-selection': ['not_started', 'in_progress'],
    }
  }
}
