import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type DetailsOfDomesticAbuseConcernsBody = {
  victimDetails: string
  safeguarding: YesOrNo
  safeguardingDetail: string
}

@Page({
  name: 'details-of-domestic-abuse-concerns',
  bodyProperties: ['victimDetails', 'safeguarding', 'safeguardingDetail'],
})
export default class DomesticAbuseConcerns implements TaskListPage {
  documentTitle = 'Add concerns related to domestic abuse'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Add concerns related to domestic abuse'

  questions = getQuestions(this.personName)['risk-information']['details-of-domestic-abuse-concerns']

  body: DetailsOfDomesticAbuseConcernsBody

  constructor(
    body: Partial<DetailsOfDomesticAbuseConcernsBody>,
    private readonly application: Application,
  ) {
    this.body = body as DetailsOfDomesticAbuseConcernsBody
  }

  previous() {
    return 'domestic-abuse-concerns'
  }

  next() {
    return 'violence-and-arson'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.victimDetails) {
      errors.victimDetails = 'Enter the details of any known victims'
    }

    if (!this.body.safeguarding) {
      errors.safeguarding = 'Select yes if there are any safeguarding measures or professional teams involved'
    }

    if (this.body.safeguarding === 'yes' && !this.body.safeguardingDetail) {
      errors.safeguardingDetail = 'Enter the details of any safeguarding measures or involvement of professional teams'
    }

    return errors
  }

  onSave(): void {
    if (this.body.safeguarding !== 'yes') {
      delete this.body.safeguardingDetail
    }
  }
}
