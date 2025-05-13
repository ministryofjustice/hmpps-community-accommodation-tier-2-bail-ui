import { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type OASysRiskAssessmentBody = {
  riskAssessment: YesOrNo
  oasysHasBeenUpdated: YesOrNo
}

@Page({
  name: 'oasys-risk-assessment',
  bodyProperties: ['riskAssessment', 'oasysHasBeenUpdated'],
})
export default class OASysRiskAssessment implements TaskListPage {
  documentTitle = 'Has an OASys risk assessment been done in the last two years?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['add-probation-supervision-details']['oasys-risk-assessment']

  body: OASysRiskAssessmentBody

  constructor(
    body: Partial<OASysRiskAssessmentBody>,
    private readonly application: Application,
  ) {
    this.body = body as OASysRiskAssessmentBody
    this.title = this.questions.riskAssessment.question
  }

  previous() {
    return 'community-probation-practitioner-details'
  }

  next() {
    if (this.body.riskAssessment === 'yes' && this.body.oasysHasBeenUpdated === 'yes') {
      return 'oasys-risk-assessment-details'
    }

    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.riskAssessment) {
      errors.riskAssessment = 'Select if an OASys risk assessment has been done in the last two years'
    }
    if (this.body.riskAssessment === 'yes' && !this.body.oasysHasBeenUpdated) {
      errors.oasysHasBeenUpdated = 'Select if an OASys risk assessment has been updated'
    }
    return errors
  }

  onSave() {
    if (this.body.riskAssessment === 'no') {
      delete this.body.oasysHasBeenUpdated
    }
  }
}
