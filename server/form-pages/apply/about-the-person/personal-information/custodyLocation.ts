import { Cas2v2Application as Application } from '@approved-premises/api'
import { TaskListErrors } from '@approved-premises/ui'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type CustodyLocationBody = {
  custodyLocation: string
}

@Page({
  name: 'custody-location',
  bodyProperties: ['custodyLocation'],
})
export default class CustodyLocation implements TaskListPage {
  documentTitle = 'Where is the person being held in custody?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Where is ${this.personName} being held in custody?`

  questions = getQuestions(this.personName)['personal-information']['custody-location']

  body: CustodyLocationBody

  constructor(
    body: Partial<CustodyLocationBody>,
    private readonly application: Application,
  ) {
    this.body = body as CustodyLocationBody
    this.title = this.questions.custodyLocation.question
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'working-mobile-phone'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.custodyLocation) {
      errors.custodyLocation = 'Enter where the applicant is being held in custody'
    }

    return errors
  }
}
