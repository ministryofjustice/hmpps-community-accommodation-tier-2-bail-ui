import type { TaskListErrors, ObjectWithDateParts, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { dateBodyProperties } from '../../../utils'
import {
  dateAndTimeInputsAreValidDates,
  DateFormats,
  dateIsComplete,
  dateIsTodayOrInTheFuture,
} from '../../../../utils/dateUtils'

const applicationQuestions = getQuestions('')

export const hearingMediumOptions =
  applicationQuestions['bail-hearing-information']['bail-hearing-information'].bailHearingMedium.answers

export type BailHearingInformationBody = {
  isBailHearingDateKnown: YesOrNo
  courtName: string
  bailHearingMedium: keyof typeof hearingMediumOptions
} & ObjectWithDateParts<'bailHearingDate'>

@Page({
  name: 'bail-hearing-information',
  bodyProperties: [
    'isBailHearingDateKnown',
    ...dateBodyProperties('bailHearingDate'),
    'courtName',
    'bailHearingMedium',
  ],
})
export default class BailHearingInformation implements TaskListPage {
  documentTitle = 'Add bail hearing information'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Add bail hearing information'

  questions = getQuestions(this.personName)['bail-hearing-information']['bail-hearing-information']

  body: BailHearingInformationBody

  constructor(
    body: Partial<BailHearingInformationBody>,
    private readonly application: Application,
  ) {
    this.body = body as BailHearingInformationBody
  }

  previous() {
    return 'taskList'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.isBailHearingDateKnown) {
      errors.isBailHearingDateKnown = 'Select if you know when their bail hearing is'
    }

    if (this.body.isBailHearingDateKnown === 'yes') {
      if (!dateIsComplete(this.body, 'bailHearingDate')) {
        errors.bailHearingDate = 'Bail hearing date must include a day, month and year'
      } else if (!dateAndTimeInputsAreValidDates(this.body, 'bailHearingDate')) {
        errors.bailHearingDate = 'Bail hearing date must be a real date'
      } else if (!dateIsTodayOrInTheFuture(this.body, 'bailHearingDate')) {
        errors.bailHearingDate = 'Bail hearing date must be today or in the future'
      }
    }
    return errors
  }

  response() {
    return {
      [this.questions.isBailHearingDateKnown.question]:
        this.questions.isBailHearingDateKnown.answers[this.body.isBailHearingDateKnown],
      [this.questions.bailHearingDate.question]: dateAndTimeInputsAreValidDates(this.body, 'bailHearingDate')
        ? DateFormats.dateAndTimeInputsToUiDate(this.body, 'bailHearingDate')
        : '',
      [this.questions.courtName.question]: this.body.courtName ?? '',
      [this.questions.bailHearingMedium.question]:
        this.questions.bailHearingMedium.answers[this.body.bailHearingMedium] ?? '',
    }
  }

  onSave() {
    if (this.body.isBailHearingDateKnown !== 'yes') {
      delete this.body['bailHearingDate-day']
      delete this.body['bailHearingDate-month']
      delete this.body['bailHearingDate-year']
    }
  }

  items() {
    const items = convertKeyValuePairToRadioItems(hearingMediumOptions, this.body.bailHearingMedium)

    return items
  }
}
