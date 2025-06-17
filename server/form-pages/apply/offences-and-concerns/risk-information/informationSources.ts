/* eslint-disable no-param-reassign */
import type { ObjectWithDateParts, Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'
import { dateBodyProperties } from '../../../utils'
import {
  dateAndTimeInputsAreValidDates,
  DateFormats,
  dateIsComplete,
  dateIsTodayOrInTheFuture,
} from '../../../../utils/dateUtils'

const applicationQuestions = getQuestions('')

export const options = applicationQuestions['risk-information']['information-sources'].informationSources.answers

export type InformationSourcesBody = {
  informationSources: Array<keyof typeof options>
  otherSourcesDetail: string
} & ObjectWithDateParts<'previousOasysDate'>

@Page({
  name: 'information-sources',
  bodyProperties: ['informationSources', ...dateBodyProperties('previousOasysDate'), 'otherSourcesDetail'],
})
export default class InformationSources implements TaskListPage {
  documentTitle = 'Where did you get the information on concerns about the applicant from?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Where did you get the information on concerns about the applicant from?'

  questions = getQuestions(this.personName)['risk-information']['information-sources']

  body: InformationSourcesBody

  constructor(
    body: Partial<InformationSourcesBody>,
    private readonly application: Application,
  ) {
    this.body = body as InformationSourcesBody
  }

  previous() {
    return 'risk-management-arrangements'
  }

  next() {
    return ''
  }

  items(otherSourcesDetail: string, previousOasysDate: string) {
    const items = convertKeyValuePairToCheckboxItems(options, this.body.informationSources) as [Radio]

    items.forEach(item => {
      if (item.value === 'previousOasys') {
        item.conditional = { html: previousOasysDate }
      }
    })

    const other = items.pop()
    return [...items, { ...other, conditional: { html: otherSourcesDetail } }]
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.informationSources) {
      errors.informationSources = 'Select where you got the information on concerns from'
    } else if (this.body.informationSources.includes('previousOasys')) {
      if (!dateIsComplete(this.body, 'previousOasysDate')) {
        errors.previousOasysDate = 'Previous OASys date must include a day, month and year'
      } else if (!dateAndTimeInputsAreValidDates(this.body, 'previousOasysDate')) {
        errors.previousOasysDate = 'Previous OASys date must be a real date'
      } else if (dateIsTodayOrInTheFuture(this.body, 'previousOasysDate')) {
        errors.previousOasysDate = 'Previous OASys date must be in the past'
      }
    }

    return errors
  }

  onSave(): void {
    if (!this.body.informationSources.includes('other')) {
      delete this.body.otherSourcesDetail
    }
  }

  response() {
    const response: Record<string, string> = {}

    const sourcesArr = Array.isArray(this.body.informationSources)
      ? this.body.informationSources
      : [this.body.informationSources]

    let sourceList = ''
    sourcesArr.forEach(source => {
      if (this.isOasys(source)) {
        sourceList += `Previous or current OASys\r\n`
        return
      }
      sourceList += `${this.questions.informationSources.answers[source]}\r\n`
    })

    response[this.questions.informationSources.question] = sourceList

    if (sourcesArr.includes('previousOasys')) {
      response[this.questions.previousOasysDate.question] = DateFormats.dateAndTimeInputsToUiDate(
        { ...this.body, informationSources: null },
        'previousOasysDate',
      )
    }

    response[this.questions.otherSourcesDetail.question] = this.body.otherSourcesDetail ?? ''

    return response
  }

  isOasys(value: string): value is typeof value {
    return value === 'oasys'
  }
}
