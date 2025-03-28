import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type AllegedOffencesSummaryBody = {
  summary: string
}

@Page({
  name: 'alleged-offences-summary',
  bodyProperties: ['summary'],
})
export default class AllegedOffencesSummary implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = 'Alleged offences summary'

  title = `Alleged offences summary for ${this.personName}`

  body: AllegedOffencesSummaryBody

  questions = getQuestions('')['alleged-offences']['alleged-offences-summary']

  constructor(
    body: Partial<AllegedOffencesSummaryBody>,
    private readonly application: Application,
  ) {
    this.body = body as AllegedOffencesSummaryBody
  }

  previous() {
    return 'alleged-offences'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.summary) {
      errors.summary = 'Enter a summary of the alleged offences'
    }

    return errors
  }
}

