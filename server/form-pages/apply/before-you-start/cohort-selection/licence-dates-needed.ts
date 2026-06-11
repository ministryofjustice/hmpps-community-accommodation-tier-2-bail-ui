import { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type LicenceDatesNeededBody = {
  licenceDatesNeeded: YesOrNo
}

@Page({
  name: 'licence-dates-needed',
  bodyProperties: ['licenceDatesNeeded'],
})
export default class LicenceDatesNeeded implements TaskListPage {
  isOtherCohort = this.application.applicationOrigin === 'other'

  documentTitle = 'Licence dates needed'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Is ${this.personName} on licence for a different offence?`

  questions: Record<string, string>

  options: Record<string, string>

  body: { licenceDatesNeeded: YesOrNo }

  constructor(
    body: Partial<LicenceDatesNeededBody>,
    private readonly application: Cas2v2Application,
  ) {
    this.body = body as LicenceDatesNeededBody

    const applicationQuestions = getQuestions(this.personName)
    this.questions = {
      licenceDatesNeeded: applicationQuestions.licence['licence-dates-needed'].licenceDatesNeeded.question,
    }
    this.options = applicationQuestions.licence['licence-dates-needed'].licenceDatesNeeded.answers
  }

  previous() {
    return 'cohort-selection'
  }

  next() {
    return this.body.licenceDatesNeeded === 'yes' ? 'licence-dates' : ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.licenceDatesNeeded) {
      errors.licenceDatesNeeded = `Select yes if ${this.personName} is on licence for a different offence`
    }
    return errors
  }

  items() {
    return convertKeyValuePairToRadioItems(this.options, this.body.licenceDatesNeeded)
  }

  isApplicable() {
    return this.application.applicationOrigin === 'other'
  }
}
