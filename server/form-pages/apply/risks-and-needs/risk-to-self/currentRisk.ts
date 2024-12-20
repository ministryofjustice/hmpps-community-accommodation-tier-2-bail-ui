import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getOasysImportDateFromApplication } from '../../../utils'
import { getQuestions } from '../../../utils/questions'
import { hasOasys } from '../../../../utils/applicationUtils'

type CurrentRiskBody = { currentRiskDetail: string; confirmation: string }

@Page({
  name: 'current-risk',
  bodyProperties: ['currentRiskDetail', 'confirmation'],
})
export default class CurrentRisk implements TaskListPage {
  documentTitle = "The person's current risks"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `${this.personName}'s current risks`

  questions = getQuestions(this.personName)['risk-to-self']['current-risk']

  body: CurrentRiskBody

  importDate = getOasysImportDateFromApplication(this.application, 'risk-to-self')

  hasOasysRecord: boolean

  constructor(
    body: Partial<CurrentRiskBody>,
    private readonly application: Application,
  ) {
    this.body = body as CurrentRiskBody
    this.hasOasysRecord = hasOasys(application, 'risk-to-self')
  }

  previous() {
    return 'vulnerability'
  }

  next() {
    return 'historical-risk'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.currentRiskDetail) {
      errors.currentRiskDetail = `Describe ${this.personName}'s current issues and needs related to self harm and suicide`
    }

    return errors
  }
}
