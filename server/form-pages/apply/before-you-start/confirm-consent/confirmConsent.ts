/* eslint-disable no-param-reassign */
import type { Radio, TaskListErrors, YesOrNo, ObjectWithDateParts } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { dateBodyProperties } from '../../../utils'
import {
  DateFormats,
  dateAndTimeInputsAreValidDates,
  dateIsTodayOrInThePast,
  dateIsComplete,
} from '../../../../utils/dateUtils'

type ConfirmConsentBody = {
  hasGivenConsent: YesOrNo
  consentRefusalDetail: string
} & ObjectWithDateParts<'consentDate'>

@Page({
  name: 'confirm-consent',
  bodyProperties: ['hasGivenConsent', ...dateBodyProperties('consentDate'), 'consentRefusalDetail'],
})
export default class ConfirmConsent implements TaskListPage {
  documentTitle = "Confirm the person's consent to apply for Short-Term Accommodation (CAS-2)"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Confirm ${this.personName}'s consent`

  questions

  body: ConfirmConsentBody

  constructor(
    body: Partial<ConfirmConsentBody>,
    private readonly application: Application,
  ) {
    if (body.hasGivenConsent === 'yes') {
      body.consentRefusalDetail = ''
    }
    if (body.hasGivenConsent === 'no') {
      body.consentDate = ''
      body['consentDate-day'] = ''
      body['consentDate-month'] = ''
      body['consentDate-year'] = ''
    }
    this.body = body as ConfirmConsentBody

    const applicationQuestions = getQuestions(this.personName)
    this.questions = applicationQuestions['confirm-consent']['confirm-consent']
  }

  previous() {
    return 'taskList'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.hasGivenConsent) {
      errors.hasGivenConsent = 'Select if the applicant has given their verbal consent'
    } else if (this.body.hasGivenConsent === 'no' && !this.body.consentRefusalDetail) {
      errors.consentRefusalDetail = 'Enter the applicant’s reason for refusing consent'
    } else if (this.body.hasGivenConsent === 'yes' && !dateIsComplete(this.body, 'consentDate')) {
      errors.consentDate = 'Date of consent must include a day, month and year'
    } else if (this.body.hasGivenConsent === 'yes' && !dateAndTimeInputsAreValidDates(this.body, 'consentDate')) {
      errors.consentDate = 'Date of consent must be a real date'
    } else if (this.body.hasGivenConsent === 'yes' && !dateIsTodayOrInThePast(this.body, 'consentDate')) {
      errors.consentDate = 'Date of consent must be today or in the past'
    }
    return errors
  }

  items(dateHtml: string, refusalDetailHtml: string) {
    const items = convertKeyValuePairToRadioItems(
      this.questions.hasGivenConsent.answers,
      this.body.hasGivenConsent,
    ) as Array<Radio>

    items.forEach(item => {
      if (item.value === 'yes') {
        item.conditional = { html: dateHtml }
      }
      if (item.value === 'no') {
        item.conditional = { html: refusalDetailHtml }
      }
    })

    return items
  }

  response() {
    return {
      [this.questions.hasGivenConsent.question]: this.questions.hasGivenConsent.answers[this.body.hasGivenConsent],
      ...(this.body.hasGivenConsent === 'yes' && {
        [this.questions.consentDate.question]: DateFormats.isoDateToUIDate(this.body.consentDate, { format: 'medium' }),
      }),
      ...(this.body.hasGivenConsent === 'no' && {
        [this.questions.consentRefusalDetail.question]: this.body.consentRefusalDetail,
      }),
    }
  }
}
