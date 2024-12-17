import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

type CourtNameBody = {
  courtName: string
}

@Page({
  name: 'court-name',
  bodyProperties: ['courtName'],
})
export default class CourtName implements TaskListPage {
  documentTitle = "What's the name of the court where the bail hearing will take place?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['bail-hearing-information']['court-name']

  body: CourtNameBody

  constructor(
    body: Partial<CourtNameBody>,
    private readonly application: Application,
  ) {
    this.body = body as CourtNameBody
    this.title = this.questions.courtName.question
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'bail-hearing-date'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
