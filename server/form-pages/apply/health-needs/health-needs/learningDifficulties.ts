import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type LearningDifficultiesBody = {
  hasLearningDifficultiesOrNeurodiversityNeeds: YesOrNo
}

@Page({
  name: 'learning-difficulties',
  bodyProperties: ['hasLearningDifficultiesOrNeurodiversityNeeds'],
})
export default class LearningDifficulties implements TaskListPage {
  documentTitle = 'Does the applicant have any learning difficulties or neurodiversity needs?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Does ${this.personName} have any learning difficulties or neurodiversity needs?`

  questions = getQuestions(this.personName)['health-needs']['learning-difficulties']

  body: LearningDifficultiesBody

  constructor(
    body: Partial<LearningDifficultiesBody>,
    private readonly application: Application,
  ) {
    this.body = body as LearningDifficultiesBody
  }

  previous() {
    return 'communication-and-language-relevance-check'
  }

  next() {
    if (this.body.hasLearningDifficultiesOrNeurodiversityNeeds === 'yes') {
      return 'learning-difficulties-details'
    }
    return 'brain-injury'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasLearningDifficultiesOrNeurodiversityNeeds) {
      errors.hasLearningDifficultiesOrNeurodiversityNeeds =
        'Select yes if they have any learning difficulties or neurodiversity needs'
    }

    return errors
  }

  response() {
    const response: Record<string, string> = {}

    response[this.questions.hasLearningDifficultiesOrNeurodiversityNeeds.question] =
      this.questions.hasLearningDifficultiesOrNeurodiversityNeeds.answers[
        this.body.hasLearningDifficultiesOrNeurodiversityNeeds
      ]

    if (this.body.hasLearningDifficultiesOrNeurodiversityNeeds === 'yes') {
      const detailsPageQuestions = getQuestions(this.personName)['health-needs']['learning-difficulties-details']
      const detailsPageData = this.application.data['health-needs']['learning-difficulties-details']

      response[detailsPageQuestions.learningNeedsDetail.question] = detailsPageData.learningNeedsDetail

      response[detailsPageQuestions.needsSupport.question] =
        detailsPageQuestions.needsSupport.answers[detailsPageData.needsSupport as YesOrNo]
      if (detailsPageData.needsSupport === 'yes') {
        response[detailsPageQuestions.supportDetail.question] = detailsPageData.supportDetail
      }

      response[detailsPageQuestions.receivesTreatment.question] =
        detailsPageQuestions.receivesTreatment.answers[detailsPageData.receivesTreatment as YesOrNo]
      if (detailsPageData.receivesTreatment === 'yes') {
        response[detailsPageQuestions.treatmentDetail.question] = detailsPageData.treatmentDetail
      }

      response[detailsPageQuestions.isVulnerable.question] =
        detailsPageQuestions.isVulnerable.answers[detailsPageData.isVulnerable as YesOrNo]
      if (detailsPageData.isVulnerable === 'yes') {
        response[detailsPageQuestions.vulnerabilityDetail.question] = detailsPageData.vulnerabilityDetail
      }
    }

    return response
  }
}
