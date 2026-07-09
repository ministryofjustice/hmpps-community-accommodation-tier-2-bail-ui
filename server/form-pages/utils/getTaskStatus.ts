import type { TaskStatus, UiTask } from '@approved-premises/ui'

import { Cas2Application as Application } from '@approved-premises/api'
import { TaskListPageInterface } from '../taskListPage'

export const getPageData = (application: Application, taskName: string, pageName: string) => {
  return application.data?.[taskName]?.[pageName]
}

const getTaskStatus = (task: UiTask, application: Application): TaskStatus => {
  // if the first page is not applicable -> not_applicable
  // if any page has an error -> in_progress
  // if some pages are complete and some are incomplete -> in_progress
  // if all pages are complete -> complete
  // otherwise -> not_started

  let pageName = Object.keys(task.pages)[0]

  const FirstPageConstructor = task.pages[pageName] as TaskListPageInterface
  const firstPage = FirstPageConstructor && new FirstPageConstructor({}, application)

  if (firstPage?.isApplicable && !firstPage.isApplicable()) {
    return 'not_applicable'
  }

  let hasIncompletePages = false
  let hasCompletePages = false

  while (pageName) {
    const pageData = getPageData(application, task.id, pageName)
    const PageConstructor = task.pages[pageName] as TaskListPageInterface
    const page = PageConstructor && new PageConstructor(pageData || {}, application)

    if (!pageData) {
      if (page?.canBeSkipped?.() !== true) {
        // no data for the current required page, page must be incomplete
        hasIncompletePages = true
      }
    } else if (Object.keys(page.errors()).length > 0) {
      // if any page has an error, the task must be in_progress
      return 'in_progress'
    } else {
      // no errors, page must be complete
      hasCompletePages = true
    }

    // if some pages are incomplete and some are complete, the task must be in_progress
    if (hasIncompletePages && hasCompletePages) {
      return 'in_progress'
    }

    pageName = page.next()
  }

  // must be all complete or all incomplete
  return hasCompletePages ? 'complete' : 'not_started'
}

export default getTaskStatus
