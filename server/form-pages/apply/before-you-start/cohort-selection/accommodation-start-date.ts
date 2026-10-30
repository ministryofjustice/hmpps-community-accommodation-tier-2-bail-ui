import { Cas2Application } from '@approved-premises/api'
import { ObjectWithDateParts, TaskListErrors } from '@approved-premises/ui'
import { Page } from '../../../utils/decorators'
import BasePage from '../../../utils/basePage'
import { validateDateParts } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { dateBodyProperties } from '../../../utils'

export type AccommodationStartDateBody = ObjectWithDateParts<'accommodationStartDate'>

@Page({
  name: 'accommodation-start-date',
  bodyProperties: [...dateBodyProperties('accommodationStartDate')],
})
export default class AccommodationStartDate extends BasePage {
  isOtherCohort = this.application.applicationOrigin === 'other'

  documentTitle = 'Accommodation start date'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'What date is accommodation required from?'

  body: AccommodationStartDateBody

  constructor(
    body: Partial<AccommodationStartDateBody>,
    private readonly application: Cas2Application,
  ) {
    super()

    this.body = body as AccommodationStartDateBody

    this.questions = getQuestions(this.personName)['cohort-selection']['accommodation-start-date']
  }

  previous() {
    return this.application.data?.['cohort-selection']?.['licence-dates-needed']?.licenceDatesNeeded === 'no'
      ? 'licence-dates-needed'
      : 'licence-dates'
  }

  errors() {
    return this.accommodationStartDateErrors() as TaskListErrors<this>
  }

  private accommodationStartDateErrors() {
    const dateParts = ['day', 'month', 'year'] as const
    const missingDateParts = dateParts.filter(part => !this.body[`accommodationStartDate-${part}`])

    if (missingDateParts.length === dateParts.length) {
      return { accommodationStartDate: 'Enter a date the accommodation is required from' }
    }

    if (missingDateParts.length) {
      return {
        accommodationStartDate: `Date accommodation is required from must include a ${missingDateParts.join(' and ')}`,
      }
    }

    return validateDateParts<AccommodationStartDateBody>(
      'accommodationStartDate',
      'Date accommodation is required from',
      this.body,
      { future: true },
    )
  }

  isApplicable() {
    return this.application.applicationOrigin === 'other'
  }
}
