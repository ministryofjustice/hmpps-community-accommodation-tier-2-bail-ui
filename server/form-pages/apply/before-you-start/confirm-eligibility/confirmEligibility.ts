import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type ConfirmEligibilityBody = {
  isEligible: YesOrNo
}
@Page({
  name: 'confirm-eligibility',
  bodyProperties: ['isEligible'],
})
export default class ConfirmEligibility implements TaskListPage {
  documentTitle = 'Confirm the applicant is eligible'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Confirm ${this.personName} is eligible for short-term accommodation (CAS2) for bail`

  questions: Record<string, string>

  options: Record<string, string>

  body: ConfirmEligibilityBody

  constructor(
    body: Partial<ConfirmEligibilityBody>,
    private readonly application: Application,
  ) {
    this.body = body as ConfirmEligibilityBody

    const applicationQuestions = getQuestions(this.personName)
    this.questions = {
      isEligible: applicationQuestions['confirm-eligibility']['confirm-eligibility'].isEligible.question,
    }
    this.options = applicationQuestions['confirm-eligibility']['confirm-eligibility'].isEligible.answers
  }

  previous() {
    return 'taskList'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.isEligible) {
      errors.isEligible = 'Confirm whether the applicant is eligible or not eligible'
    }
    return errors
  }

  items() {
    return convertKeyValuePairToRadioItems(this.options, this.body.isEligible)
  }
}
