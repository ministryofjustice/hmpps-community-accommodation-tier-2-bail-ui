import { Cas2v2Application } from '@approved-premises/api'
import { ObjectWithDateParts, Radio, RadioItem, TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems, validateDateParts } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { dateBodyProperties } from '../../../utils'

export type LicenceDatesBody = {
  hasHdcExpiryDate: YesOrNo
} & ObjectWithDateParts<'licenceStartDate'> &
  ObjectWithDateParts<'licenceEndDate'> &
  ObjectWithDateParts<'hdcExpiryDate'>

@Page({
  name: 'licence-dates',
  bodyProperties: [
    'hasHdcExpiryDate',
    ...dateBodyProperties('licenceStartDate'),
    ...dateBodyProperties('licenceEndDate'),
    ...dateBodyProperties('hdcExpiryDate'),
  ],
})
export default class LicenceDates implements TaskListPage {
  isOtherCohort = this.application.applicationOrigin === 'other'

  documentTitle = 'Licence dates needed'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `${this.personName}'s licence`

  questions: Record<string, string>

  options: Record<string, Array<RadioItem>>

  body: LicenceDatesBody

  constructor(
    body: Partial<LicenceDatesBody>,
    private readonly application: Cas2v2Application,
  ) {
    this.body = body as LicenceDatesBody

    const applicationQuestions = getQuestions(this.personName).licence['licence-dates']
    this.questions = Object.entries(applicationQuestions).reduce(
      (out, [key, question]) => ({ ...out, [key]: question.question }),
      {},
    )
    if (application.cohort === 'rarr') this.questions.licenceStartDate = undefined
    if (application.cohort !== 'atcr') this.questions.hasHdcExpiryDate = undefined

    this.options = {
      hasHdcExpiryDate: convertKeyValuePairToRadioItems(
        applicationQuestions.hasHdcExpiryDate.answers,
        this.body.hasHdcExpiryDate,
      ),
    }
  }

  previous() {
    return this.application.cohort === 'isc' ? 'licence-dates-needed' : 'cohort-selection'
  }

  next() {
    return ''
  }

  errors() {
    return {
      ...(this.questions.licenceStartDate
        ? validateDateParts<LicenceDatesBody>('licenceStartDate', 'Licence start date', this.body)
        : {}),
      ...validateDateParts<LicenceDatesBody>('licenceEndDate', 'Licence end date', this.body, { future: true }),
      ...(this.questions.hasHdcExpiryDate && this.body.hasHdcExpiryDate === 'yes'
        ? validateDateParts<LicenceDatesBody>('hdcExpiryDate', 'HDC expiry date', this.body)
        : ({} as TaskListErrors<LicenceDates>)),
      ...(this.questions.hasHdcExpiryDate && !this.body.hasHdcExpiryDate
        ? { hasHdcExpiryDate: 'Select yes if they have a HDC expiry date' }
        : {}),
    } as TaskListErrors<this>
  }

  onSave() {
    if (this.body.hasHdcExpiryDate === 'no') {
      delete this.body['hdcExpiryDate-year']
      delete this.body['hdcExpiryDate-month']
      delete this.body['hdcExpiryDate-day']
    }
  }

  isApplicable() {
    return this.application.applicationOrigin === 'other'
  }

  hdcRadioItems(conditionals: Record<string, unknown>) {
    return this.options.hasHdcExpiryDate.map(option => {
      return {
        ...option,
        conditional: conditionals[(option as Radio).value],
      }
    })
  }
}
