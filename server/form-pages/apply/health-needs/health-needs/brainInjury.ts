import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type BrainInjuryBody = {
  hasBrainInjury: YesOrNo
}

@Page({
  name: 'brain-injury',
  bodyProperties: ['hasBrainInjury'],
})
export default class BrainInjury implements TaskListPage {
  documentTitle = 'Does the applicant have a brain injury?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Does ${this.personName} have a brain injury?`

  questions = getQuestions(this.personName)['health-needs']['brain-injury']

  body: BrainInjuryBody

  constructor(
    body: Partial<BrainInjuryBody>,
    private readonly application: Application,
  ) {
    this.body = body as BrainInjuryBody
  }

  previous() {
    return 'learning-difficulties'
  }

  next() {
    if (this.body.hasBrainInjury === 'yes') {
      return 'brain-injury-details'
    }
    return 'other-health'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasBrainInjury) {
      errors.hasBrainInjury = 'Select yes if they have any brain injury'
    }

    return errors
  }

  response() {
    const response: Record<string, string> = {}

    response[this.questions.hasBrainInjury.question] = this.questions.hasBrainInjury.answers[this.body.hasBrainInjury]

    if (this.body.hasBrainInjury === 'yes') {
      const detailsPageQuestions = getQuestions(this.personName)['health-needs']['brain-injury-details']
      const detailsPageData = this.application.data['health-needs']['brain-injury-details']

      response[detailsPageQuestions.injuryDetail.question] = detailsPageData.injuryDetail

      response[detailsPageQuestions.supportNeeded.question] =
        detailsPageQuestions.supportNeeded.answers[detailsPageData.supportNeeded as YesOrNo]
      if (detailsPageData.supportNeeded === 'yes') {
        response[detailsPageQuestions.supportDetail.question] = detailsPageData.supportDetail
      }

      response[detailsPageQuestions.receivingTreatment.question] =
        detailsPageQuestions.receivingTreatment.answers[detailsPageData.receivingTreatment as YesOrNo]
      if (detailsPageData.receivingTreatment === 'yes') {
        response[detailsPageQuestions.treatmentDetail.question] = detailsPageData.treatmentDetail
      }

      response[detailsPageQuestions.isVulnerable.question] =
        detailsPageQuestions.isVulnerable.answers[detailsPageData.isVulnerable as YesOrNo]
      if (detailsPageData.isVulnerable === 'yes') {
        response[detailsPageQuestions.vulnerabilityDetail.question] = detailsPageData.vulnerabilityDetail
      }

      response[detailsPageQuestions.hasDifficultyInteracting.question] =
        detailsPageQuestions.hasDifficultyInteracting.answers[detailsPageData.hasDifficultyInteracting as YesOrNo]
      if (detailsPageData.hasDifficultyInteracting === 'yes') {
        response[detailsPageQuestions.interactionDetail.question] = detailsPageData.interactionDetail
      }
    }

    return response
  }
}
