import { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { NonBailCohort } from '../../../../utils/applications/cohortLabels'

export type CohortSelectionBody = {
  cohort: NonBailCohort
  notes: string
}

@Page({
  name: 'cohort-selection',
  bodyProperties: ['cohort', 'notes'],
})
export default class CohortSelection implements TaskListPage {
  isOtherCohort = this.application.applicationOrigin === 'other'

  documentTitle = 'Type of application'

  personName = nameOrPlaceholderCopy(this.application.person)

  title: string

  questions

  body: CohortSelectionBody

  constructor(
    body: CohortSelectionBody,
    private readonly application: Application,
  ) {
    this.body = body

    const applicationQuestions = getQuestions(this.personName)
    this.questions = applicationQuestions['cohort-selection']['cohort-selection']
    this.title = this.questions.cohort.question
  }

  previous() {
    return 'taskList'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.cohort) {
      errors.cohort = `Select why ${this.personName} needs CAS2 accommodation`
    }
    return errors
  }

  items() {
    return convertKeyValuePairToRadioItems(this.questions.cohort.answers, this.body.cohort) as Array<Radio>
  }

  response() {
    return {
      [this.questions.cohort.question]: this.questions.cohort.answers[this.body.cohort],
      [this.questions.notes.question]: this.body.notes,
    }
  }

  isApplicable() {
    return this.application.applicationOrigin === 'other'
  }
}
