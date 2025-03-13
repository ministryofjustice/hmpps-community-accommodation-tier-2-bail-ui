import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type SafetyOfStaffBody = {}

@Page({
  name: 'safety-of-staff',
  bodyProperties: [],
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

    return errors
  }
}
