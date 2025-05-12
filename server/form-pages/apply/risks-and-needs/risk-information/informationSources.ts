import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'

const applicationQuestions = getQuestions('')

export const options = applicationQuestions['risk-information']['information-sources'].informationSources.answers

export type InformationSourcesBody = {
  informationSources: Array<keyof typeof options>
  otherSourcesDetail: string
}

@Page({
  name: 'information-sources',
  bodyProperties: ['informationSources', 'otherSourcesDetail'],
})
export default class InformationSources implements TaskListPage {
  documentTitle = 'Where did you get the information on concerns about the applicant from?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Where did you get the information on concerns about the applicant from?'

  questions = getQuestions(this.personName)['risk-information']['information-sources']

  body: InformationSourcesBody

  constructor(
    body: Partial<InformationSourcesBody>,
    private readonly application: Application,
  ) {
    this.body = body as InformationSourcesBody
  }

  previous() {
    return 'risk-management-arrangements'
  }

  next() {
    return ''
  }

  items(otherSourcesDetail: string) {
    const items = convertKeyValuePairToCheckboxItems(options, this.body.informationSources)
    const other = items.pop()

    return [...items, { ...other, conditional: { html: otherSourcesDetail } }]
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.informationSources) {
      errors.informationSources = 'Select where you got the information on concerns from'
    }

    return errors
  }

  onSave(): void {
    if (!this.body.informationSources.includes('other')) {
      delete this.body.otherSourcesDetail
    }
  }

  response() {
    const response: Record<string, string> = {}

    const sourcesArr = Array.isArray(this.body.informationSources)
      ? this.body.informationSources
      : [this.body.informationSources]

    let sourceList = ''
    sourcesArr.forEach(source => {
      sourceList += `${this.questions.informationSources.answers[source]}\r\n`
    })

    response[this.questions.informationSources.question] = sourceList
    response[this.questions.otherSourcesDetail.question] = this.body.otherSourcesDetail ?? ''

    return response
  }
}
