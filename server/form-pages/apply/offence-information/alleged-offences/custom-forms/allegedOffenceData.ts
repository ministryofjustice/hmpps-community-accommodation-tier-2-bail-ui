import type { SelectItem, TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { dateAndTimeInputsAreValidDates } from '../../../../../utils/dateUtils'
import { getQuestions } from '../../../../utils/questions'
import { nameOrPlaceholderCopy } from '../../../../../utils/utils'

export type AllegedOffenceDataBody = {
  titleAndNumber: string
  offenceCategory: string
  offenceDate: string
  'offenceDate-day': string
  'offenceDate-month': string
  'offenceDate-year': string
  summary: string
}

@Page({
  name: 'alleged-offence-data',
  bodyProperties: [
    'titleAndNumber',
    'offenceCategory',
    'offenceDate-day',
    'offenceDate-month',
    'offenceDate-year',
    'summary',
  ],
})
export default class AllegedOffenceData implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = 'Add a alleged offence'

  title = `Add ${this.personName}'s alleged offence details`

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
    this.offenceCategories = this.getCategoriesAsItemsForSelect(this.body.offenceCategory)
    this.hasPreviouslySavedAnAllegedOffence = Boolean(application.data['alleged-offences']?.['alleged-offence-data'])
  }

  private getCategoriesAsItemsForSelect(selectedItem: string): Array<SelectItem> {
    const items = [
      {
        value: 'choose',
        text: 'Choose type',
        selected: selectedItem === '',
      },
    ]
    Object.keys(this.questions.offenceCategory.answers).forEach(value => {
      items.push({
        value,
        text: this.questions.offenceCategory.answers[
          value as keyof typeof this.questions.offenceCategory.answers
        ] as string,
        selected: selectedItem === value,
      })
    })

    return items
  }

  previous() {
    return 'alleged-offences'
  }

  next() {
    return 'alleged-offences'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.titleAndNumber) {
      errors.titleAndNumber = 'Enter the offence title'
    }
    if (this.body.offenceCategory === 'choose') {
      errors.offenceCategory = 'Select the offence type'
    }
    if (!dateAndTimeInputsAreValidDates(this.body, 'offenceDate')) {
      errors.offenceDate = 'Enter the date the offence was committed'
    }
    if (!this.body.summary) {
      errors.summary = 'Enter a summary of the offence'
    }

    return errors
  }

  response() {
    return {}
  }
}
