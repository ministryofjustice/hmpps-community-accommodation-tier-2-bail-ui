import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type LivingInTheCommunityBody = {}

@Page({
  name: 'living-in-the-community',
  bodyProperties: [],
})
export default class LivingInTheCommunity implements TaskListPage {
  documentTitle = 'Living in the community'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Living in the community'

  questions = getQuestions(this.personName)['risk-information']['living-in-the-community']

  body: LivingInTheCommunityBody

  constructor(
    body: Partial<LivingInTheCommunityBody>,
    private readonly application: Application,
  ) {
    this.body = body as LivingInTheCommunityBody
  }

  previous() {
    return 'violence-and-arson'
  }

  next() {
    return 'safety-of-staff'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
