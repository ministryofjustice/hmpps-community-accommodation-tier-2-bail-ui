import { Cas2v2Application as Application } from '@approved-premises/api'
import { TaskListErrors, YesOrNoOrPreferNotToSay } from '@approved-premises/ui'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'
import { isPersonMale } from '../../../../utils/personUtils'

export type GenderBody = {
  gender: YesOrNoOrPreferNotToSay
  genderIdentity: string
}

@Page({
  name: 'gender',
  bodyProperties: ['gender', 'genderIdentity'],
})
export default class Gender implements TaskListPage {
  documentTitle = 'Is the gender the person identifies with the same as the sex registered at birth?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['personal-information'].gender

  body: GenderBody

  constructor(
    body: Partial<GenderBody>,
    private readonly application: Application,
  ) {
    this.body = body as GenderBody
    this.title = this.questions.gender.question
  }

  previous() {
    return ''
  }

  next() {
    if (isPersonMale(this.application.person)) {
      return ''
    }

    return 'pregnancy-information'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.gender) {
      errors.gender =
        "Select if the gender they identify with is the same as the sex registered at birth or 'Prefer not to say'"
    }

    return errors
  }

  onSave(): void {
    if (this.body.gender !== 'no') {
      delete this.body.genderIdentity
    }
  }
}
