import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type SafetyOfStaffBody = {
  pastRiskToStaff: YesOrNo
  pastRiskToStaffDetail: string
  currentConcerns: YesOrNo
  currentConcernsDetail: string
}

@Page({
  name: 'safety-of-staff',
  bodyProperties: ['pastRiskToStaff', 'pastRiskToStaffDetail', 'currentConcerns', 'currentConcernsDetail'],
})
export default class SafetyOfStaff implements TaskListPage {
  documentTitle = 'Concerns related to the safety of staff'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Concerns related to the safety of staff'

  questions = getQuestions(this.personName)['risk-information']['safety-of-staff']

  body: SafetyOfStaffBody

  constructor(
    body: Partial<SafetyOfStaffBody>,
    private readonly application: Application,
  ) {
    this.body = body as SafetyOfStaffBody
  }

  previous() {
    return 'living-in-the-community'
  }

  next() {
    return 'additional-concerns'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.pastRiskToStaff) {
      errors.pastRiskToStaff = 'Select if they have posed a risk to the safety of any staff'
    }

    if (this.body.pastRiskToStaff === 'yes' && !this.body.pastRiskToStaffDetail) {
      errors.pastRiskToStaffDetail = 'Enter details of the incidents'
    }

    if (!this.body.currentConcerns) {
      errors.currentConcerns = 'Select if there are any current concerns over the safety of any staff'
    }

    if (this.body.currentConcerns === 'yes' && !this.body.currentConcernsDetail) {
      errors.currentConcernsDetail = 'Enter details of current concerns'
    }

    return errors
  }

  onSave(): void {
    if (this.body.pastRiskToStaff !== 'yes') {
      delete this.body.pastRiskToStaffDetail
    }

    if (this.body.currentConcerns !== 'yes') {
      delete this.body.currentConcernsDetail
    }
  }
}
