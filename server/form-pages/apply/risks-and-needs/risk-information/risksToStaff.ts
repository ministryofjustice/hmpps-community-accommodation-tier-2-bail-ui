import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type RisksToStaffBody = {}

@Page({
  name: 'risks-to-staff',
  bodyProperties: [],
})
export default class RisksToStaff implements TaskListPage {
  documentTitle = 'Risks to staff'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Risks to staff'

  questions = getQuestions(this.personName)['risk-information']['risks-to-staff']

  body: RisksToStaffBody

  constructor(
    body: Partial<RisksToStaffBody>,
    private readonly application: Application,
  ) {
    this.body = body as RisksToStaffBody
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
