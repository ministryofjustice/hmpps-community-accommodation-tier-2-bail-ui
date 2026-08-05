import { Cas2Application as Application, Cas2SubmittedApplication, FullPerson } from '@approved-premises/api'
import { SummaryListItem, FormSection, QuestionAndAnswer, UiTask } from '@approved-premises/ui'
import Apply from '../form-pages/apply/index'
import CheckYourAnswers from '../form-pages/apply/check-your-answers'
import paths from '../paths/apply'
import { getQuestions, getQuestion, Questions } from '../form-pages/utils/questions'
import { nameOrPlaceholderCopy } from './utils'
import { formatLines } from './viewUtils'
import TaskListPage, { TaskListPageInterface } from '../form-pages/taskListPage'
import getTaskStatus from '../form-pages/utils/getTaskStatus'
import { UnknownPageError } from './errors'
import { DateFormats } from './dateUtils'
import { summaryListItem } from './formUtils'
import { applicationTypeLabel } from './applications/cohortLabels'

export const taskAppliesToApplication = (task: UiTask, application: Application): boolean =>
  getTaskStatus(task, application) !== 'not_applicable'

export const checkYourAnswersSections = (application: Application) => {
  const sections = getSections()

  const sectionsWithAnswers = sections
    .map(section => {
      return {
        title: section.title,
        tasks: section.tasks
          .filter(task => taskAppliesToApplication(task, application))
          .map(task => {
            return {
              id: task.id,
              title: task.title,
              rows: getTaskAnswersAsSummaryListItems(task.id, application),
            }
          }),
      }
    })
    .filter(section => section.tasks.length > 0)

  return sectionsWithAnswers
}

export const getTaskAnswersAsSummaryListItems = (
  task: string,
  application: Application,
  outputFormat: 'checkYourAnswers' | 'document' = 'checkYourAnswers',
): Array<SummaryListItem | QuestionAndAnswer> => {
  const items: Array<SummaryListItem | QuestionAndAnswer> = []

  // Get the latest question schema
  const questions = getQuestions(nameOrPlaceholderCopy(application.person))

  // Get the page keys stored on the application at creation
  const applicationPageKeys = getKeysForPages(application, task)

  // Filter out any keys that are no longer in the latest question schema
  const relevantPagesKeys = removeAnyOldPageKeys(questions, task, applicationPageKeys)

  // For each page key we know we have a matching question for, prepare it for display
  relevantPagesKeys.forEach(pageKey => {
    addPageAnswersToItemsArray({
      items,
      application,
      task,
      pageKey,
      questions,
      outputFormat,
    })
  })
  return items
}

export const addPageAnswersToItemsArray = (params: {
  items: Array<SummaryListItem | QuestionAndAnswer>
  application: Application
  task: string
  pageKey: string
  questions: Questions
  outputFormat: 'checkYourAnswers' | 'document'
}) => {
  const { items, application, task, pageKey, questions, outputFormat } = params
  const PageClass = getPage(task, pageKey)

  const body = application?.data?.[task]?.[pageKey]
  const page = new PageClass(body, application)
  const response = page.response?.()
  if (response) {
    Object.keys(response).forEach((question, index) => {
      if (outputFormat === 'checkYourAnswers') {
        items.push(
          summaryListItemForQuestion(application, task, pageKey, { question, answer: response[question] }, index),
        )
      } else {
        items.push({ question, answer: response[question] })
      }
    })
  } else {
    const questionKeys = Object.keys(application.data[task][pageKey])
    if (containsQuestions(questionKeys)) {
      questionKeys.forEach((questionKey, index) => {
        const answer = getAnswer(application, questions, task, pageKey, questionKey)
        if (!answer) {
          return
        }

        const questionText = getQuestion(questions, task, pageKey, questionKey)?.question

        if (!questionText) {
          return
        }

        if (outputFormat === 'checkYourAnswers') {
          items.push(summaryListItemForQuestion(application, task, pageKey, { question: questionText, answer }, index))
        } else {
          items.push({ question: questionText, answer })
        }
      })
    }
  }
}

export const getAnswer = (
  application: Application,
  questions: Questions,
  task: string,
  pageKey: string,
  questionKey: string,
): string | undefined => {
  if (hasDefinedAnswers(questions, task, pageKey, questionKey)) {
    if (Array.isArray(application.data[task][pageKey][questionKey])) {
      return arrayAnswersAsString(application, questions, task, pageKey, questionKey)
    }

    const question = getQuestion(questions, task, pageKey, questionKey)
    const answerKey = application.data[task][pageKey][questionKey] as string
    return question?.answers?.[answerKey]
  }
  return application.data[task][pageKey][questionKey] as string
}

export const arrayAnswersAsString = (
  application: Application,
  questions: Questions,
  task: string,
  pageKey: string,
  questionKey: string,
): string => {
  const answerKeys = application.data[task][pageKey][questionKey]
  const question = getQuestion(questions, task, pageKey, questionKey)

  return answerKeys
    .map((answerKey: string) => question?.answers?.[answerKey])
    .filter((answer: string | undefined) => answer !== undefined)
    .join()
}

export const summaryListItemForQuestion = (
  application: Application,
  task: string,
  pageKey: string,
  questionAndAnswer: Record<string, string>,
  index: number,
) => {
  const { question, answer } = questionAndAnswer

  const actions = {
    items: [
      {
        href: paths.applications.pages.show({ task, page: pageKey, id: application.id }),
        text: 'Change',
        classes: 'print__hidden',
        visuallyHiddenText: question,
        attributes: { 'data-testid': `${task}-${pageKey}-${index}` },
      },
    ],
  }

  return {
    key: {
      html: question,
    },
    value: { html: formatLines(answer as string) },
    actions,
  }
}

export const getSections = (): Array<FormSection> => {
  const { sections } = Apply

  return sections.filter(section => section.name !== CheckYourAnswers.name)
}

export const getKeysForPages = (application: Application, task: string) => {
  const pages = application.data[task]

  // Allow viewing of the CYA page with incomplete tasks
  if (!pages) {
    return []
  }

  const pagesKeys = Object.keys(pages)

  return pagesKeys
}

const containsQuestions = (questionKeys: Array<string>): boolean => {
  if (!questionKeys.length) {
    return false
  }
  return true
}

const hasDefinedAnswers = (questions: Questions, task: string, pageKey: string, questionKey: string): boolean => {
  return getQuestion(questions, task, pageKey, questionKey)?.answers !== undefined
}

export const hasResponseMethod = (page: TaskListPage): boolean => {
  return 'response' in page
}

export const getPage = (taskName: string, pageName: string): TaskListPageInterface => {
  const pageList = Apply.pages[taskName as keyof typeof Apply.pages]

  const Page = pageList[pageName]

  if (!Page) {
    throw new UnknownPageError(pageName)
  }

  return Page as TaskListPageInterface
}

export const getApplicantDetails = (application: Application | Cas2SubmittedApplication): Array<SummaryListItem> => {
  const { crn, nomsNumber, pncNumber, name, dateOfBirth, nationality, sex, prisonName } =
    application.person as FullPerson

  return [
    summaryListItem('Application type', applicationTypeLabel(application), 'html', true),
    summaryListItem('Full name', name, 'html'),
    summaryListItem('Date of birth', DateFormats.isoDateToUIDate(dateOfBirth, { format: 'short' }), 'html'),
    summaryListItem('Nationality', nationality || 'Unknown', 'html'),
    summaryListItem('Sex', sex, 'html'),
    summaryListItem('Prison number', nomsNumber, 'html', true),
    summaryListItem('Prison', prisonName, 'html', true),
    summaryListItem('PNC number', pncNumber || 'Unable to import', 'html'),
    summaryListItem('CRN from NDelius', crn, 'html'),
  ].filter(Boolean)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeAnyOldPageKeys = (questions: any, task: string, applicationPageKeys: string[]): string[] => {
  const latestPageKeys = Object.keys(questions[task])
  const matchedKeys = applicationPageKeys.filter(
    key =>
      latestPageKeys.includes(key) ||
      ['acct', 'alleged-offences', 'current-offences', 'unspent-convictions'].includes(key),
  )
  return matchedKeys
}
