import { Request, Response } from 'express'
import type { ApplicationDocument, FormPages, JourneyType, SideNavItem, UiTimelineEvent } from '@approved-premises/ui'
import type {
  Cas2v2Application as Application,
  Cas2v2Application,
  Cas2v2SubmittedApplication,
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

export const journeyPages = (_journeyType: JourneyType): FormPages => {
  return Apply.pages
}

export const firstPageOfBeforeYouStartSection = (application: Application) => {
  return paths.applications.pages.show({ id: application.id, task: 'confirm-eligibility', page: 'confirm-eligibility' })
}

export const eligibilityQuestionIsAnswered = (application: Application): boolean => {
  return eligibilityAnswer(application) === 'yes' || eligibilityAnswer(application) === 'no'
}

export const eligibilityIsConfirmed = (application: Application): boolean => {
  return eligibilityAnswer(application) === 'yes'
}
export const eligibilityIsDenied = (application: Application): boolean => {
  return eligibilityAnswer(application) === 'no'
}

const eligibilityAnswer = (application: Application): string => {
  return application.data?.['confirm-eligibility']?.['confirm-eligibility']?.isEligible
}

export const firstPageOfConsentTask = (application: Application) => {
  return paths.applications.pages.show({ id: application.id, task: 'confirm-consent', page: 'confirm-consent' })
}

export const consentIsAnswered = (application: Application): boolean => {
  return application.data?.['confirm-consent']
}

export const getTimelineEvents = (timelineEvents: Array<Cas2TimelineEvent>): Array<UiTimelineEvent> => {
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
  application: Cas2v2Application | Cas2v2SubmittedApplication,
): Array<UiTimelineEvent> => getTimelineEvents(application.timelineEvents)

export const generateSuccessMessage = (pageName: string): string => {
  switch (pageName) {
    case 'alleged-offence-data':
      return 'Alleged offence saved'
    case 'unspent-convictions-data':
      return 'Unspent conviction saved'
    case 'add-acct-note':
      return 'The ACCT has been saved'
    default:
      return ''
  }
}

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
  if (eligibilityIsConfirmed(application)) {
    if (consentIsAnswered(application)) {
      const { errors, errorSummary } = fetchErrorsAndUserInput(req)

      const referer = validateReferer(req.headers.referer)
      const taskList = new TaskListService(application)
      return res.render('applications/taskList', { application, taskList, errors, errorSummary, referer })
    }
    return res.redirect(firstPageOfConsentTask(application))
  }

  if (eligibilityIsDenied(application)) {
    return res.redirect(paths.applications.ineligible({ id: application.id }))
  }

  return res.redirect(firstPageOfBeforeYouStartSection(application))
}
