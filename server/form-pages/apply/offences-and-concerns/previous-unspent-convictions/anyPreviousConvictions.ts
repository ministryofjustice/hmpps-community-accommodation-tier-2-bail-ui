import { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

export enum PreviousConvictionsAnswers {
  YesRelevantRisk = 'yesRelevantRisk',
  YesNoRelevantRisk = 'yesNoRelevantRisk',
  No = 'no',
}

type AnyPreviousConvictionsBody = {
  hasAnyPreviousConvictions: PreviousConvictionsAnswers
}

@Page({
  name: 'any-previous-convictions',
  bodyProperties: ['hasAnyPreviousConvictions'],
})
export default class AnyPreviousConvictions implements TaskListPage {
  documentTitle = `Check any previous unspent convictions`

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Check any previous unspent convictions`

  questions = getQuestions(this.personName)['previous-unspent-convictions']['any-previous-convictions']

  options: Record<string, string>

  body: AnyPreviousConvictionsBody

  constructor(
    body: Partial<AnyPreviousConvictionsBody>,
    private readonly application: Application,
  ) {
    this.body = body as AnyPreviousConvictionsBody
  }

  previous() {
    return 'taskList'
  }

  next() {
    if (this.body.hasAnyPreviousConvictions === 'yesRelevantRisk') {
      if (this.application.data['previous-unspent-convictions']?.['unspent-convictions-data']?.length > 0) {
        return 'unspent-convictions'
      }
      return 'unspent-convictions-data'
    }
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (
      !this.body.hasAnyPreviousConvictions ||
      !Object.values(PreviousConvictionsAnswers).includes(this.body.hasAnyPreviousConvictions)
    ) {
      errors.hasAnyPreviousConvictions = 'Select if they have any previous unspent convictions'
    }
    return errors
  }
}
