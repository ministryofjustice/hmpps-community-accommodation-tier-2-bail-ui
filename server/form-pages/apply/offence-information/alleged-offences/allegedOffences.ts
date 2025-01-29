import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import AllegedOffenceData, { AllegedOffenceDataBody } from './custom-forms/allegedOffenceData'
import { DateFormats } from '../../../../utils/dateUtils'
import { createQueryString, nameOrPlaceholderCopy } from '../../../../utils/utils'
import paths from '../../../../paths/apply'
import { getQuestions } from '../../../utils/questions'

type AllegedOffencesBody = { offenceList: string }

type AllegedOffencesUI = {
  titleAndNumber: string
  offenceCategoryTag: string
  offenceCategoryText: string
  offenceDate: string
  summary: string
  removeLink: string
}

@Page({
  name: 'alleged-offences',
  bodyProperties: ['offenceList'],
})
export default class AllegedOffences implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = 'Alleged offences'

  title = `Alleged offences for ${this.personName}`

  body: AllegedOffencesBody

  offences: AllegedOffencesUI[]

  pageName = 'alleged-offences'

  dataPageName = 'alleged-offence-data'

  taskName = 'alleged-offences'

  allegedOffenceQuestions = getQuestions('')['alleged-offences']['alleged-offence-data']

  constructor(
    body: Partial<AllegedOffencesBody>,
    private readonly application: Application,
  ) {
    if (application.data[this.taskName]?.[this.dataPageName]) {
      const allegedOffencesData = application.data[this.taskName][this.dataPageName] as [AllegedOffenceDataBody]

      const query = {
        redirectPage: this.pageName,
      }

      this.offences = allegedOffencesData.map((offence, index) => {
        const offenceDate = DateFormats.dateAndTimeInputsToUiDate(offence, 'offenceDate')

        const offenceCategoryText =
          this.allegedOffenceQuestions.offenceCategory.answers[
            offence.offenceCategory as keyof typeof this.allegedOffenceQuestions.offenceCategory.answers
          ]

        return {
          titleAndNumber: offence.titleAndNumber,
          offenceCategoryTag: this.getOffenceCategoryTag(offence.offenceCategory, offenceCategoryText),
          offenceCategoryText,
          offenceDate,
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
    this.body = body as AllegedOffencesBody
  }

  static async initialize(body: Partial<AllegedOffenceDataBody>, application: Application) {
    if (!application.data['alleged-offences']?.['alleged-offence-data']) {
      return new AllegedOffenceData(body, application)
    }
    return new AllegedOffences({}, application)
  }

  previous() {
    return 'taskList'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.application.data['alleged-offences']?.['alleged-offence-data'].length) {
      errors.offenceList = 'Alleged offences must be added to the application'
    }

    return errors
  }

  response() {
    const response: Record<string, string> = {}

    this.offences?.forEach((offence, index) => {
      const { titleAndNumber, offenceCategoryText, offenceDate, summary } = offence
      response[`Alleged offence ${index + 1}`] =
        `${titleAndNumber}\r\n${offenceCategoryText}\r\n${offenceDate}\r\n\nSummary: ${summary}`
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
}
