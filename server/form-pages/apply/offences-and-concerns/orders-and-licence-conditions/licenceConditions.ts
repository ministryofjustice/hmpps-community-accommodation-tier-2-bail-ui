import { TaskListErrors, YesNoOrDontKnow } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type LicenceConditionsBody = {
  hasLicenceConditions: YesNoOrDontKnow
  notes: string
}

@Page({
  name: 'licence-conditions',
  bodyProperties: ['hasLicenceConditions', 'notes'],
})
export default class LicenceConditions implements TaskListPage {
  documentTitle = `Add non-standard licence conditions`

  personName = nameOrPlaceholderCopy(this.application.person)

  title: string

  questions = getQuestions(this.personName)['orders-and-licence-conditions']['licence-conditions']

  body: LicenceConditionsBody

  constructor(
    body: Partial<LicenceConditionsBody>,
    private readonly application: Application,
  ) {
    this.body = body as LicenceConditionsBody
    this.title = this.questions.hasLicenceConditions.question
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'orders'
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.hasLicenceConditions)
      errors.hasLicenceConditions = 'Select yes if they have any non-standard licence conditions'
    else if (this.body.hasLicenceConditions === 'yes' && !this.body.notes)
      errors.notes = 'Provide details of the non-standard licence conditions!'

    return errors
  }

  isApplicable(): boolean {
    return this.application.applicationOrigin === 'other'
  }

  onSave(): void {
    if (this.body.hasLicenceConditions !== 'yes') {
      delete this.body.notes
    }
  }
}
