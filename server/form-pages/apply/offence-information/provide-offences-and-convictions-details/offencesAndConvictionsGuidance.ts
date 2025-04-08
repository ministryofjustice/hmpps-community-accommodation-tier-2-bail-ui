import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

type OffencesAndConvictionsGuidanceBody = Record<string, unknown>

@Page({
  name: 'offences-and-convictions-guidance',
  bodyProperties: [],
})
export default class OffencesAndConvictionsGuidance implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = `The applicant's current alleged offences and previous convictions`

  title = `${this.personName}'s current alleged offences and previous convictions`

  body: OffencesAndConvictionsGuidanceBody

  questions = getQuestions(this.personName)['provide-offences-and-convictions-details'][
    'offences-and-convictions-guidance'
  ]

  constructor(
    body: Partial<OffencesAndConvictionsGuidanceBody>,
    private readonly application: Application,
  ) {
    this.body = body as OffencesAndConvictionsGuidanceBody
  }

  previous() {
    return 'taskList'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  response() {
    return {
      [this.title]: 'Guidance confirmed',
    }
  }
}
