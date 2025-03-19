import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type AdditionalConcernsBody = {}

@Page({
  name: 'additional-concerns',
  bodyProperties: [],
})
export default class AdditionalConcerns implements TaskListPage {
  documentTitle = 'Additional concerns'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Additional concerns'

  questions = getQuestions(this.personName)['risk-information']['additional-concerns']

  body: AdditionalConcernsBody

  constructor(
    body: Partial<AdditionalConcernsBody>,
    private readonly application: Application,
  ) {
    this.body = body as AdditionalConcernsBody
  }

  previous() {
    return 'safety-of-staff'
  }

  next() {
    return 'risk-management-arrangements'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
