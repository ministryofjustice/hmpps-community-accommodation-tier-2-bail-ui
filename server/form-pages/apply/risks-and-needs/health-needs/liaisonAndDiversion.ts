import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

type LiaisonAndDiversionBody = {
  liaisonAndDiversionAssessment: YesOrNo
}

@Page({
  name: 'liaison-and-diversion',
  bodyProperties: ['liaisonAndDiversionAssessment'],
})
export default class LiaisonAndDiversion implements TaskListPage {
  documentTitle = 'Liaison & Diversion Assessment for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Liaison & Diversion Assessment for ${this.personName}`

  questions = getQuestions(this.personName)['health-needs']['liaison-and-diversion']

  body: LiaisonAndDiversionBody

  constructor(
    body: Partial<LiaisonAndDiversionBody>,
    private readonly application: Application,
  ) {
    this.body = body as LiaisonAndDiversionBody
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'independent-living'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.liaisonAndDiversionAssessment) {
      errors.liaisonAndDiversionAssessment = `Confirm whether a Liaison & Diversion Assessment has been requested`
    }

    return errors
  }
}
