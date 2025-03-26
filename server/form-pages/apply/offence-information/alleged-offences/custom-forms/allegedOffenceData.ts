import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { getQuestions } from '../../../../utils/questions'
import { nameOrPlaceholderCopy } from '../../../../../utils/utils'

type AllegedOffence = {
  name: string
}

export type AllegedOffenceDataBody = {
  allegedOffences?: AllegedOffence[]
}

@Page({
  name: 'alleged-offence-data',
  bodyProperties: ['allegedOffences'],
})
export default class AllegedOffenceData implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = 'Add a alleged offence'

  title = `Add ${this.personName}'s alleged offence details`

  body: AllegedOffenceDataBody

  taskName = 'alleged-offences'

  pageName = 'alleged-offence-data'

  questions = getQuestions('')['alleged-offences']['alleged-offence-data']

  constructor(
    body: Partial<AllegedOffenceDataBody>,
    private readonly application: Cas2v2Application,
  ) {
    this.body = body as AllegedOffenceDataBody
  }

  previous() {
    return 'alleged-offences'
  }

  next() {
    return 'alleged-offences'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (this.body.allegedOffences) {
      this.body.allegedOffences.forEach((allegedOffence, index) => {
        if (!allegedOffence.name) {
          ;(errors as Record<string, unknown>)[`allegedOffences[${index}][name]`] =
            'Enter the name of the current alleged offence'
        }
      })
    }

    return errors
  }

  response() {
    return {}
  }
}
