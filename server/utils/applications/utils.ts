import { Request, Response } from 'express'
import type { ApplicationDocument, FormPages, JourneyType, SideNavItem, UiTimelineEvent } from '@approved-premises/ui'
import type {
  Cas2Application as Application,
  Cas2Application,
  Cas2SubmittedApplication,
  Cas2TimelineEvent,
} from '@approved-premises/api'
import { getSections } from '../checkYourAnswersUtils'
import { stringToKebabCase, formatCommaToLinebreak } from '../utils'
import { formatLines, validateReferer } from '../viewUtils'
import Apply from '../../form-pages/apply'
import paths from '../../paths/apply'
import { DateFormats } from '../dateUtils'
import { fetchErrorsAndUserInput } from '../validation'
import { TaskListService } from '../../services'
import { cohortSelectionAnswers, NonBailCohort } from './cohortLabels'

export const journeyPages = (_journeyType: JourneyType): FormPages => {
  return Apply.pages
}

const eligibilityAnswer = (application: Application): string => {
  return application.data?.['confirm-eligibility']?.['confirm-eligibility']?.isEligible
}

const getTimelineEvents = (timelineEvents: Array<Cas2TimelineEvent>): Array<UiTimelineEvent> => {
  if (timelineEvents) {
    return timelineEvents
      .sort((a, b) => Number(DateFormats.isoToDateObj(b.occurredAt)) - Number(DateFormats.isoToDateObj(a.occurredAt)))
      .map(sortedTimelineEvents => {
        const description =
          sortedTimelineEvents.type === 'cas2_status_update' && sortedTimelineEvents.body
            ? formatCommaToLinebreak(sortedTimelineEvents.body)
            : formatLines(sortedTimelineEvents.body)

        return {
          label: { text: sortedTimelineEvents.label },
          byline: {
            text: sortedTimelineEvents.createdByName,
          },
          datetime: {
            timestamp: sortedTimelineEvents.occurredAt,
            date: DateFormats.isoDateTimeToUIDateTime(sortedTimelineEvents.occurredAt),
          },
          description: {
            text: description,
          },
        }
      })
  }
  return []
}

export const getApplicationTimelineEvents = (
  application: Cas2Application | Cas2SubmittedApplication,
): Array<UiTimelineEvent> => getTimelineEvents(application.timelineEvents)

export const generateSuccessMessage = (pageName: string): string =>
  ({
    'alleged-offence-data': 'Alleged offence saved',
    'unspent-convictions-data': 'Unspent conviction saved',
    'add-acct-note': 'The ACCT has been saved',
  })[pageName] || ''

export const getSideNavLinksForDocument = (document: ApplicationDocument) => {
  const tasks: Array<SideNavItem> = []

  document.sections.forEach(section => {
    section.tasks.forEach(task => tasks.push({ href: `#${stringToKebabCase(task.title)}`, text: task.title }))
  })

  return tasks
}

export const getSideNavLinksForApplication = () => {
  const sections = getSections()

  const tasks: Array<SideNavItem> = []

  sections.forEach(section => {
    section.tasks.forEach(task => tasks.push({ href: `#${stringToKebabCase(task.title)}`, text: task.title }))
  })

  return tasks
}

export const showMissingRequiredTasksOrTaskList = (req: Request, res: Response, application: Application) => {
  const taskList = new TaskListService(application)
  const { requiredTasks, formSections, taskStatuses } = taskList

  if (eligibilityAnswer(application) === 'no') {
    return res.redirect(paths.applications.ineligible({ id: application.id }))
  }
  const allTasks = formSections.map(({ tasks }) => tasks || []).flat()
  const requiredTask = allTasks.find(task => {
    const taskStates = requiredTasks[task.id]
    return taskStates && taskStates.includes(taskStatuses[task.id])
  })

  if (requiredTask) {
    // Not all required tasks are in an allowable state
    return res.redirect(
      paths.applications.pages.show({
        id: application.id,
        task: requiredTask.id,
        page: Object.keys(requiredTask.pages)[0],
      }),
    )
  }
  const { errors, errorSummary } = fetchErrorsAndUserInput(req)

  const referer = validateReferer(req.headers.referer)

  return res.render('applications/taskList', {
    application,
    cohortLabel: cohortSelectionAnswers[application.cohort as NonBailCohort],
    title: application.applicationOrigin === 'other' ? 'Apply for CAS2' : 'Apply for CAS2 for Bail',
    taskList,
    errors,
    errorSummary,
    referer,
  })
}
