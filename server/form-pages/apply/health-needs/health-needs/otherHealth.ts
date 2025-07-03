import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type OtherHealthBody = {
  hasOtherHealthNeeds: YesOrNo
  healthNeedsDetail: string
}

@Page({
  name: 'other-health',
  bodyProperties: ['hasOtherHealthNeeds', 'healthNeedsDetail'],
})
export default class OtherHealth implements TaskListPage {
  documentTitle = 'Does the applicant have other health needs?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = ''

  questions = getQuestions(this.personName)['health-needs']['other-health']

  body: OtherHealthBody

  constructor(
    body: Partial<OtherHealthBody>,
    private readonly application: Application,
  ) {
    this.body = body as OtherHealthBody
  }

  previous() {
    return 'brain-injury'
  }

  next() {
    return 'information-sources'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasOtherHealthNeeds) {
      errors.hasOtherHealthNeeds = 'Select yes if they have other health needs'
    } else if (this.body.hasOtherHealthNeeds === 'yes' && !this.body.healthNeedsDetail) {
      errors.healthNeedsDetail = 'Enter the details of their needs'
    }

    return errors
  }

  onSave(): void {
    if (this.body.hasOtherHealthNeeds !== 'yes') {
      delete this.body.healthNeedsDetail
    }
  }
}
