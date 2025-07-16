import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type DomesticAbuseConcernsBody = {
  areConcerns: YesOrNo
}

@Page({
  name: 'domestic-abuse-concerns',
  bodyProperties: ['areConcerns'],
})
export default class DomesticAbuseConcerns implements TaskListPage {
  documentTitle = 'Concerns related to domestic abuse for the applicant'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Concerns related to domestic abuse for ${this.personName}`

  questions = getQuestions(this.personName)['risk-information']['domestic-abuse-concerns']

  body: DomesticAbuseConcernsBody

  constructor(
    body: Partial<DomesticAbuseConcernsBody>,
    private readonly application: Application,
  ) {
    this.body = body as DomesticAbuseConcernsBody
  }

  previous() {
    return 'does-the-applicant-have-acct-notes'
  }

  next() {
    if (this.body.areConcerns === 'yes') {
      return 'details-of-domestic-abuse-concerns'
    }
    return 'violence-and-arson'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.areConcerns) {
      errors.areConcerns = 'Select yes if there are any concerns related to domestic abuse'
    }

    return errors
  }
}
