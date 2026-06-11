import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import CurrentOffenceData, { CurrentOffenceDataBody } from './custom-forms/currentOffenceData'
import { DateFormats } from '../../../../utils/dateUtils'
import { createQueryString, nameOrPlaceholderCopy } from '../../../../utils/utils'
import paths from '../../../../paths/apply'
import { getQuestions } from '../../../utils/questions'

type CurrentOffencesBody = { offenceList: string }

type CurrentOffencesUI = {
  titleAndNumber: string
  offenceCategoryTag: string
  offenceCategoryText: string
  offenceDate: string
  sentenceLength: string
  summary: string
  removeLink: string
}

@Page({
  name: 'current-offences',
  bodyProperties: ['offenceList'],
})
export default class CurrentOffences implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = 'Current offences'

  title = `Current offences for ${this.personName}`

  body: CurrentOffencesBody

  offences: CurrentOffencesUI[]

  pageName = 'current-offences'

  dataPageName = 'current-offence-data'

  taskName = 'current-offences'

  currentOffenceQuestions = getQuestions('')['current-offences']['current-offence-data']

  constructor(
    body: Partial<CurrentOffencesBody>,
    private readonly application: Application,
  ) {
    if (application.data?.[this.taskName]?.[this.dataPageName]) {
      const CurrentOffencesData = application.data[this.taskName][this.dataPageName] as [CurrentOffenceDataBody]

      const query = {
        redirectPage: this.pageName,
      }

      this.offences = CurrentOffencesData.map((offence, index) => {
        const offenceDate = DateFormats.dateAndTimeInputsToUiDate(offence, 'offenceDate')

        const offenceCategoryText = this.currentOffenceQuestions.offenceCategory.answers[offence.offenceCategory]

        return {
          titleAndNumber: offence.titleAndNumber,
          offenceCategoryTag: this.getOffenceCategoryTag(offence.offenceCategory, offenceCategoryText),
          offenceCategoryText,
          offenceDate,
          sentenceLength: offence.sentenceLength,
          summary: offence.summary,
          removeLink: `${paths.applications.removeFromList({
            id: application.id,
            task: this.taskName,
            page: this.dataPageName,
            index: index.toString(),
          })}?${createQueryString(query)}`,
        }
      })
    }
    this.body = body as CurrentOffencesBody
  }

  static async initialize(body: Partial<CurrentOffenceDataBody>, application: Application) {
    if (!application.data?.['current-offences']?.['current-offence-data']) {
      return new CurrentOffenceData(body, application)
    }
    return new CurrentOffences({}, application)
  }

  previous() {
    return 'taskList'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.application.data?.['current-offences']?.['current-offence-data']?.length) {
      errors.offenceList = 'Current offences must be added to the application'
    }

    return errors
  }

  response() {
    const response: Record<string, string> = {}

    this.offences?.forEach(({ titleAndNumber, offenceCategoryText, offenceDate, sentenceLength, summary }, index) => {
      response[`Current offence ${index + 1}`] =
        `${titleAndNumber}\r\n${offenceCategoryText}\r\n${offenceDate}\r\n${sentenceLength}\r\n\nSummary: ${summary}`
    })

    return response
  }

  getOffenceCategoryTag(offenceCategory: string, offenceCategoryText: string) {
    return `<strong class="govuk-tag govuk-tag--${this.getOffenceTagColour(
      offenceCategory,
    )}">${offenceCategoryText}</strong>`
  }

  getOffenceTagColour(offenceCategory: string) {
    switch (offenceCategory) {
      case 'stalkingOrHarassment':
        return 'blue'
      case 'weaponsOrFirearms':
        return 'red'
      case 'arson':
        return 'yellow'
      case 'violence':
        return 'pink'
      case 'domesticAbuse':
        return 'purple'
      case 'hateCrime':
        return 'green'
      case 'drugs':
        return 'custom-brown'
      default:
        return 'grey'
    }
  }

  isApplicable() {
    return this.application.applicationOrigin === 'other'
  }
}
