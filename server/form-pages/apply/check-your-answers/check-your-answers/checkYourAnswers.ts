import type { TaskListErrors } from '@approved-premises/ui'
import type { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import { isFullPerson } from '../../../../utils/utils'

import TaskListPage from '../../../taskListPage'
import { getCustodyLocation } from '../../../../utils/getApplicationSummaryData'

type CheckYourAnswersBody = {
  checkYourAnswers?: string
}

type ApplicationSummary = {
  id: string
  name?: string
  prisonNumber?: string
  prisonName?: string
  referrerName: string
  contactEmail?: string
  view: string
  applicationOrigin: string
  crn: string
}

@Page({ name: 'check-your-answers', bodyProperties: ['checkYourAnswers'] })
export default class CheckYourAnswers implements TaskListPage {
  documentTitle = 'Check your answers before sending your application'

  title = 'Check your answers before sending your application'

  constructor(
    public body: Partial<CheckYourAnswersBody>,
    readonly application: Application,
  ) {}

  previous() {
    return 'dashboard'
  }

  next() {
    return ''
  }

  applicationSummary(): ApplicationSummary {
    return {
      id: this.application.id,
      name: isFullPerson(this.application.person) ? this.application.person.name : null,
      prisonNumber: isFullPerson(this.application.person) ? this.application.person.nomsNumber : null,
      prisonName: getCustodyLocation(this.application),
      referrerName: this.application.createdBy.name,
      contactEmail: this.application.createdBy.email,
      applicationOrigin: this.application.applicationOrigin,
      crn: isFullPerson(this.application.person) ? this.application.person.crn : null,
      view: 'checkYourAnswers',
    }
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (this.body?.checkYourAnswers !== 'confirmed') {
      errors.checkYourAnswers =
        'I confirm to the best of my knowledge, the information provided in this referral is accurate and, where required, it has been verified by all relevant teams and services.'
    }

    return errors
  }
}
