import { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import BasePage from '../../../utils/basePage'

type LicenceDatesNeededBody = {
  licenceDatesNeeded: YesOrNo
}

@Page({
  name: 'licence-dates-needed',
  bodyProperties: ['licenceDatesNeeded'],
})
export default class LicenceDatesNeeded extends BasePage {
  isOtherCohort = this.application.applicationOrigin === 'other'

  documentTitle = 'Licence dates needed'

  personName = nameOrPlaceholderCopy(this.application.person)

  body: LicenceDatesNeededBody

  constructor(
    body: Partial<LicenceDatesNeededBody>,
    private readonly application: Cas2Application,
  ) {
    super()
    this.body = body as LicenceDatesNeededBody

    this.questions = getQuestions(this.personName)['cohort-selection']['licence-dates-needed']
    this.title = this.questions.licenceDatesNeeded.question
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

  isApplicable() {
    return this.application.applicationOrigin === 'other'
  }
}
