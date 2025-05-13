import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

type AdditionalConcernsBody = {
  additionalConcerns: YesOrNo
  additionalConcernsDetail: string
}

@Page({
  name: 'additional-concerns',
  bodyProperties: ['additionalConcerns', 'additionalConcernsDetail'],
})
export default class AdditionalConcerns implements TaskListPage {
  documentTitle = 'Add any additional concerns'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Add any additional concerns'

  questions = getQuestions(this.personName)['risk-information']['additional-concerns']

  body: AdditionalConcernsBody

  constructor(
    body: Partial<AdditionalConcernsBody>,
    private readonly application: Application,
  ) {
    this.body = body as AdditionalConcernsBody
  }

  previous() {
    return 'safety-of-staff'
  }

  next() {
    return 'risk-management-arrangements'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.additionalConcerns) {
      errors.additionalConcerns = 'Select if there are any additional past or present concerns'
    }

    if (this.body.additionalConcerns === 'yes' && !this.body.additionalConcernsDetail) {
      errors.additionalConcernsDetail = 'Enter details of additional concerns'
    }

    return errors
  }

  onSave(): void {
    if (this.body.additionalConcerns !== 'yes') {
      delete this.body.additionalConcernsDetail
    }
  }
}
