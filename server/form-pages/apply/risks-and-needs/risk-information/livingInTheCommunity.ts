import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type LivingInTheCommunityBody = {
  convictionsRelatedToHateOrAggression: YesOrNo
  convictionsDetail: string
  victimOfOthers: YesOrNo
  victimOfOthersDetail: string
  otherConcerns: YesOrNo
  otherConcernsDetail: string
  cellSharingRiskAssessment: 'yes' | 'no' | 'notInPrisonCustody'
  cellSharingRiskAssessmentDetail: string
}

@Page({
  name: 'living-in-the-community',
  bodyProperties: [
    'convictionsRelatedToHateOrAggression',
    'convictionsDetail',
    'victimOfOthers',
    'victimOfOthersDetail',
    'otherConcerns',
    'otherConcernsDetail',
    'cellSharingRiskAssessment',
    'cellSharingRiskAssessmentDetail',
  ],
})
export default class LivingInTheCommunity implements TaskListPage {
  documentTitle = 'Living in the community'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Concerns related to ${this.personName} living in the community`

  questions = getQuestions(this.personName)['risk-information']['living-in-the-community']

  body: LivingInTheCommunityBody

  constructor(
    body: Partial<LivingInTheCommunityBody>,
    private readonly application: Application,
  ) {
    this.body = body as LivingInTheCommunityBody
  }

  previous() {
    return 'violence-and-arson'
  }

  next() {
    return 'safety-of-staff'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.convictionsRelatedToHateOrAggression) {
      errors.convictionsRelatedToHateOrAggression =
        'Select if they have had any convictions or behaviours related to aggression or hate towards others'
    }

    if (this.body.convictionsRelatedToHateOrAggression === 'yes' && !this.body.convictionsDetail) {
      errors.convictionsDetail =
        'Enter the details of convictions or behaviours related to aggression or hate towards others'
    }

    if (!this.body.victimOfOthers) {
      errors.victimOfOthers = 'Select if they have been a victim of violence, bullying, or intimidation from others'
    }

    if (this.body.victimOfOthers === 'yes' && !this.body.victimOfOthersDetail) {
      errors.victimOfOthersDetail =
        'Enter the details about the applicant being a victim of violence, bullying, or intimidation'
    }

    if (!this.body.otherConcerns) {
      errors.otherConcerns = 'Select if there are other concerns with the applicant living in the community'
    }

    if (this.body.otherConcerns === 'yes' && !this.body.otherConcernsDetail) {
      errors.otherConcernsDetail = 'Enter details of current concerns'
    }

    if (!this.body.cellSharingRiskAssessment) {
      errors.cellSharingRiskAssessment = 'Select if a Cell Sharing Risk Assessment (CSRA) has been done'
    }

    if (this.body.cellSharingRiskAssessment === 'yes' && !this.body.cellSharingRiskAssessmentDetail) {
      errors.cellSharingRiskAssessmentDetail = 'Enter the concerns around sharing communal areas'
    }

    return errors
  }

  onSave(): void {
    if (this.body.convictionsRelatedToHateOrAggression !== 'yes') {
      delete this.body.convictionsDetail
    }

    if (this.body.victimOfOthers !== 'yes') {
      delete this.body.victimOfOthersDetail
    }

    if (this.body.otherConcerns !== 'yes') {
      delete this.body.otherConcernsDetail
    }

    if (this.body.cellSharingRiskAssessment !== 'yes') {
      delete this.body.cellSharingRiskAssessmentDetail
    }
  }
}
