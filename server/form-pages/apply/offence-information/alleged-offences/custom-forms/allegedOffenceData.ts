import type { SelectItem, TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { dateAndTimeInputsAreValidDates } from '../../../../../utils/dateUtils'
import { getQuestions } from '../../../../utils/questions'
import { nameOrPlaceholderCopy } from '../../../../../utils/utils'

export type AllegedOffenceDataBody = {
  offenceName: string
  offenceDate: string
  'offenceDate-day': string
  'offenceDate-month': string
  'offenceDate-year': string
}

@Page({
  name: 'alleged-offence-data',
  bodyProperties: ['offenceName', 'offenceDate-day', 'offenceDate-month', 'offenceDate-year'],
})
export default class AllegedOffenceData implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = `Add the applicant's current alleged offences`

  title = `Add ${this.personName}'s current alleged offences`

  body: AllegedOffenceDataBody

  taskName = 'alleged-offences'

  pageName = 'alleged-offence-data'

  questions = getQuestions('')['alleged-offences']['alleged-offence-data']

  offenceCategories: Array<SelectItem>

  hasPreviouslySavedAnAllegedOffence: boolean

  constructor(
    body: Partial<AllegedOffenceDataBody>,
    private readonly application: Cas2v2Application,
  ) {
    this.body = body as AllegedOffenceDataBody
    this.hasPreviouslySavedAnAllegedOffence = Boolean(application.data['alleged-offences']?.['alleged-offence-data'])
  }

  previous() {
    return 'alleged-offences'
  }

  next() {
    return 'alleged-offences'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.offenceName) {
      errors.offenceName = 'Enter the name of the current alleged offence'
    }
    if (!dateAndTimeInputsAreValidDates(this.body, 'offenceDate')) {
      errors.offenceDate = 'Enter when the alleged offence took place'
    }

    return errors
  }

  response() {
    return {}
  }
}
