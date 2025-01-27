import type { TaskListErrors, ObjectWithDateParts } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { dateBodyProperties } from '../../../utils'
import { DateFormats } from '../../../../utils/dateUtils'

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
    return 'bail-hearing-arranger'
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
      [this.questions.bailHearingDate.question]: this.body.bailHearingDate
        ? DateFormats.dateAndTimeInputsToUiDate(this.body, 'bailHearingDate')
        : '',
    }
  }
}
