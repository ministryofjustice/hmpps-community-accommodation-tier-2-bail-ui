import { Cas2v2Application as Application } from '@approved-premises/api'
import { TaskListErrors } from '@approved-premises/ui'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

type OtherAreaPreferencesBody = {
  preferenceInformation: string
}

@Page({
  name: 'other-area-preferences',
  bodyProperties: ['preferenceInformation'],
})
export default class OtherAreaPreferences implements TaskListPage {
  documentTitle = 'Other area preferences for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Other area preferences for ${nameOrPlaceholderCopy(this.application.person)}`

  questions = getQuestions(this.personName)['area-information']['other-area-preferences']

  body: OtherAreaPreferencesBody

  constructor(
    body: Partial<OtherAreaPreferencesBody>,
    private readonly application: Application,
  ) {
    this.body = body as OtherAreaPreferencesBody
  }

  previous() {
    return 'second-preferred-area'
  }

  next() {
    return 'exclusion-zones'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.preferenceInformation) {
      errors.preferenceInformation = 'Enter other preferences information'
    }

    return errors
  }
}
