import { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { dateBodyProperties } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import {
  dateIsComplete,
  dateAndTimeInputsAreValidDates,
  dateIsTodayOrInThePast,
  DateFormats,
} from '../../../../utils/dateUtils'

type ContactedCppAboutCurrentRiskLevelsBody = {
  hasContactedCppAboutCurrentRiskLevels: YesOrNo
  contactDate: string
  'contactDate-day': string
  'contactDate-month': string
  'contactDate-year': string
}

@Page({
  name: 'contacted-cpp-about-current-risk-levels',
  bodyProperties: ['hasContactedCppAboutCurrentRiskLevels', ...dateBodyProperties('contactDate')],
})
export default class ContactedCppAboutCurrentRiskLevels implements TaskListPage {
  documentTitle = "Have you contacted the CPP about the applicant's current risk levels?"

  personName = nameOrPlaceholderCopy(this.application.person)

  title

  questions = getQuestions(this.personName)['add-probation-supervision-details'][
    'contacted-cpp-about-current-risk-levels'
  ]

  body: ContactedCppAboutCurrentRiskLevelsBody

  constructor(
    body: Partial<ContactedCppAboutCurrentRiskLevelsBody>,
    private readonly application: Application,
  ) {
    this.body = body as ContactedCppAboutCurrentRiskLevelsBody
    this.title = this.questions.hasContactedCppAboutCurrentRiskLevels.question
  }

  previous() {
    return 'community-probation-practitioner-details'
  }

  next() {
    if (this.body.hasContactedCppAboutCurrentRiskLevels === 'yes') {
      return 'serious-harm-risk-levels'
    }

    return 'you-must-contact-the-cpp'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasContactedCppAboutCurrentRiskLevels) {
      errors.hasContactedCppAboutCurrentRiskLevels = 'Select yes if you have contacted the CPP'
    }

    if (this.body.hasContactedCppAboutCurrentRiskLevels === 'yes') {
      if (!dateIsComplete(this.body, 'contactDate')) {
        errors.contactDate = 'Date of contact must include a day, month and year'
      } else if (!dateAndTimeInputsAreValidDates(this.body, 'contactDate')) {
        errors.contactDate = 'Date of contact must be a real date'
      } else if (!dateIsTodayOrInThePast(this.body, 'contactDate')) {
        errors.contactDate = 'Date of contact must be today or in the past'
      }
    }

    return errors
  }

  onSave() {
    if (this.body.hasContactedCppAboutCurrentRiskLevels === 'no') {
      delete this.body.contactDate
      delete this.body['contactDate-day']
      delete this.body['contactDate-month']
      delete this.body['contactDate-year']
    }
  }

  response() {
    return {
      [this.questions.hasContactedCppAboutCurrentRiskLevels.question]:
        this.questions.hasContactedCppAboutCurrentRiskLevels.answers[this.body.hasContactedCppAboutCurrentRiskLevels],
      ...(this.body.hasContactedCppAboutCurrentRiskLevels === 'yes' && {
        [this.questions.contactDate.question]: DateFormats.isoDateToUIDate(this.body.contactDate, { format: 'medium' }),
      }),
    }
  }
}
