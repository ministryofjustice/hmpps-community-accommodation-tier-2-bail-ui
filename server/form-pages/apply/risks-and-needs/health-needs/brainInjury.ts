import type { TaskListErrors, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type BrainInjuryBody = {
  hasBrainInjury: YesOrNo
  injuryDetail: string
  supportNeeded: YesOrNo
  supportDetail: string
  receivingTreatment: YesOrNo
  treatmentDetail: string
  isVulnerable: YesOrNo
  vulnerabilityDetail: string
  hasDifficultyInteracting: YesOrNo
  interactionDetail: string
}

@Page({
  name: 'brain-injury',
  bodyProperties: [
    'hasBrainInjury',
    'injuryDetail',
    'supportNeeded',
    'supportDetail',
    'receivingTreatment',
    'treatmentDetail',
    'isVulnerable',
    'vulnerabilityDetail',
    'hasDifficultyInteracting',
    'interactionDetail',
  ],
})
export default class BrainInjury implements TaskListPage {
  documentTitle = 'Brain injury details for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Brain injury details for ${this.personName}`

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
    return 'other-health'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasBrainInjury) {
      errors.hasBrainInjury = `Select if they have a brain injury`
    }
    if (this.body.hasBrainInjury === 'yes' && !this.body.injuryDetail) {
      errors.injuryDetail = 'Enter details of their brain injury and needs'
    }

    if (!this.body.supportNeeded) {
      errors.supportNeeded = `Select if they need any support`
    }
    if (this.body.supportNeeded === 'yes' && !this.body.supportDetail) {
      errors.supportDetail = 'Enter the type of support needed'
    }

    if (!this.body.receivingTreatment) {
      errors.receivingTreatment = `Select if they receive any treatment or medication`
    }
    if (this.body.receivingTreatment === 'yes' && !this.body.treatmentDetail) {
      errors.treatmentDetail = 'Enter details about their treatment and medication'
    }

    if (!this.body.isVulnerable) {
      errors.isVulnerable = `Select if they are vulnerable`
    }
    if (this.body.isVulnerable === 'yes' && !this.body.vulnerabilityDetail) {
      errors.vulnerabilityDetail = 'Enter how they are vulnerable'
    }

    if (!this.body.hasDifficultyInteracting) {
      errors.hasDifficultyInteracting = `Select if they have difficulties interacting with other people`
    }
    if (this.body.hasDifficultyInteracting === 'yes' && !this.body.interactionDetail) {
      errors.interactionDetail = 'Enter the type of difficulties they have'
    }

    return errors
  }

  onSave(): void {
    if (this.body.hasBrainInjury !== 'yes') {
      delete this.body.injuryDetail
    }

    if (this.body.supportNeeded !== 'yes') {
      delete this.body.supportDetail
    }

    if (this.body.receivingTreatment !== 'yes') {
      delete this.body.treatmentDetail
    }

    if (this.body.isVulnerable !== 'yes') {
      delete this.body.vulnerabilityDetail
    }

    if (this.body.hasDifficultyInteracting !== 'yes') {
      delete this.body.interactionDetail
    }
  }
}
