import { Cas2v2Application } from '@approved-premises/api'
import { ObjectWithDateParts, TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Page } from '../../../utils/decorators'
import BasePage from '../../../utils/basePage'
import { validateDateParts } from '../../../../utils/formUtils'
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
export default class LicenceDates extends BasePage {
  isOtherCohort = this.application.applicationOrigin === 'other'

  documentTitle = 'Licence dates needed'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `${this.personName}'s licence`

  body: LicenceDatesBody

  constructor(
    body: Partial<LicenceDatesBody>,
    private readonly application: Cas2v2Application,
  ) {
    super()

    this.body = body as LicenceDatesBody

    this.questions = getQuestions(this.personName)['cohort-selection']['licence-dates']

    if (application.cohort === 'rarr') this.questions.licenceStartDate = undefined
    if (application.cohort !== 'atcr') this.questions.hasHdcExpiryDate = undefined
  }

  previous() {
    return this.application.cohort === 'isc' ? 'licence-dates-needed' : 'cohort-selection'
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
}
