import type { TaskListErrors, ObjectWithDateParts } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { dateBodyProperties } from '../../../utils'
import { dateAndTimeInputsAreValidDates, DateFormats } from '../../../../utils/dateUtils'

export type BailHearingDateBody = ObjectWithDateParts<'bailHearingDate'>

@Page({
  name: 'bail-hearing-date',
  bodyProperties: [...dateBodyProperties('bailHearingDate')],
})
export default class BailHearingDate implements TaskListPage {
  documentTitle = "When is the person's bail hearing?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['bail-hearing-information']['bail-hearing-date']

  body: BailHearingDateBody

  constructor(
    body: Partial<BailHearingDateBody>,
    private readonly application: Application,
  ) {
    this.body = body as BailHearingDateBody

    this.title = this.questions.bailHearingDate.question
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'court-name'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  response() {
    return {
      [this.questions.bailHearingDate.question]: dateAndTimeInputsAreValidDates(this.body, 'bailHearingDate')
        ? DateFormats.dateAndTimeInputsToUiDate(this.body, 'bailHearingDate')
        : '',
    }
  }
}
