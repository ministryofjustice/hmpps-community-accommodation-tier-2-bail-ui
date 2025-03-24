/* eslint-disable no-param-reassign */
import type { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'

const applicationQuestions = getQuestions('')

export const idDocumentOptions = applicationQuestions['funding-information']['applicant-id'].idDocuments.answers

export type IDDocumentOptions = keyof typeof idDocumentOptions

export type ApplicantIDBody = {
  idDocuments: Array<IDDocumentOptions>
}

@Page({
  name: 'applicant-id',
  bodyProperties: ['idDocuments'],
})
export default class ApplicantID implements TaskListPage {
  documentTitle = 'What identity document (ID) does the applicant have?'

  title

  personName = nameOrPlaceholderCopy(this.application.person)

  questions

  body: ApplicantIDBody

  constructor(
    body: Partial<ApplicantIDBody>,
    private readonly application: Application,
  ) {
    this.questions = getQuestions(this.personName)['funding-information']['applicant-id'].idDocuments
    this.title = this.questions.question
  }

  previous() {
    return 'funding-cas2-accommodation'
  }

  next() {
    if (this.body.idDocuments.includes('none')) {
      return 'alternative-applicant-id'
    }
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}
    if (!this.body.idDocuments) {
      errors.idDocuments = errorLookups.idDocuments.empty
    }
    return errors
  }

  items() {
    const items = convertKeyValuePairToCheckboxItems(idDocumentOptions, this.body.idDocuments) as [Radio]

    const none = items.pop()

    items.forEach(item => {
      item.attributes = { 'data-selector': 'documents' }
    })

    return [...items, { divider: 'or' }, { ...none }]
  }
}
