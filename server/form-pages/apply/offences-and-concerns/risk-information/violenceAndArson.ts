import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

type ViolenceAndArsonBody = {
  pastConvictions: YesOrNo
  pastConvictionsDetail: string
  currentConcerns: YesOrNo
  currentConcernsDetail: string
}

@Page({
  name: 'violence-and-arson',
  bodyProperties: ['pastConvictions', 'pastConvictionsDetail', 'currentConcerns', 'currentConcernsDetail'],
})
export default class ViolenceAndArson implements TaskListPage {
  documentTitle = 'Add concerns of violence or arson'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Concerns related to violence or arson for ${this.personName}`

  questions = getQuestions(this.personName)['risk-information']['violence-and-arson']

  body: ViolenceAndArsonBody

  constructor(
    body: Partial<ViolenceAndArsonBody>,
    private readonly application: Application,
  ) {
    this.body = body as ViolenceAndArsonBody
  }

  previous() {
    return 'domestic-abuse-concerns'
  }

  next() {
    return 'living-in-the-community'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.pastConvictions) {
      errors.pastConvictions = 'Select if they have had any convictions or behaviours related to violence or arson'
    }

    if (this.body.pastConvictions === 'yes' && !this.body.pastConvictionsDetail) {
      errors.pastConvictionsDetail = 'Enter details of any incidents'
    }

    if (!this.body.currentConcerns) {
      errors.currentConcerns = 'Select if there are any current concerns around violence or arson'
    }

    if (this.body.currentConcerns === 'yes' && !this.body.currentConcernsDetail) {
      errors.currentConcernsDetail = 'Enter details of current concerns'
    }

    return errors
  }

  onSave(): void {
    if (this.body.pastConvictions !== 'yes') {
      delete this.body.pastConvictionsDetail
    }

    if (this.body.currentConcerns !== 'yes') {
      delete this.body.currentConcernsDetail
    }
  }
}
