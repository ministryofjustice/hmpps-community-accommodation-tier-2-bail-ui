import { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'

type YouMustContactTheCppBody = Record<string, unknown>

@Page({
  name: 'you-must-contact-the-cpp',
  bodyProperties: [],
})
export default class YouMustContactTheCpp implements TaskListPage {
  documentTitle = 'You must contact the CPP before entering the risk levels'

  title = 'You must contact the CPP before entering the risk levels'

  body: YouMustContactTheCppBody

  constructor(
    body: Partial<YouMustContactTheCppBody>,
    private readonly application: Application,
  ) {
    this.body = body as YouMustContactTheCppBody
  }

  previous() {
    return 'contacted-cpp-about-current-risk-levels'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }
}
