import type { TaskListErrors, YesNoOrNotInPrisonCustody, YesOrNo } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type SubstanceMisuseBody = {
  substanceAndAlcoholUse: YesOrNo
  substanceAndAlcoholUseDetail: string
  requiresSubstituteMedication: YesOrNo
  substituteMedicationDetail: string
  engagedWithDrugAndAlcoholService: YesOrNo | 'awaitingAssessment'
  serviceDetails: string
  intentToReferToService: YesNoOrNotInPrisonCustody
  drugAndAlcoholServiceDetail: string
  releasedWithNaloxone: YesNoOrNotInPrisonCustody
}

@Page({
  name: 'substance-misuse',
  bodyProperties: [
    'substanceAndAlcoholUse',
    'substanceAndAlcoholUseDetail',
    'requiresSubstituteMedication',
    'substituteMedicationDetail',
    'engagedWithDrugAndAlcoholService',
    'serviceDetails',
    'intentToReferToService',
    'drugAndAlcoholServiceDetail',
    'releasedWithNaloxone',
  ],
})
export default class SubstanceMisuse implements TaskListPage {
  documentTitle = 'Substance misuse needs details for the person'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Substance misuse needs details for ${nameOrPlaceholderCopy(this.application.person)}`

  questions = getQuestions(this.personName)['health-needs']['substance-misuse']

  body: SubstanceMisuseBody

  constructor(
    body: Partial<SubstanceMisuseBody>,
    private readonly application: Application,
  ) {
    this.body = body as SubstanceMisuseBody
  }

  previous() {
    return 'health-needs-information'
  }

  next() {
    return 'physical-health'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.substanceAndAlcoholUse) {
      errors.substanceAndAlcoholUse = 'Select if they have any issues related to substance and alcohol use'
    }

    if (this.body.substanceAndAlcoholUse === 'yes' && !this.body.substanceAndAlcoholUseDetail) {
      errors.substanceAndAlcoholUseDetail = 'Enter details of their issues'
    }

    if (!this.body.requiresSubstituteMedication) {
      errors.requiresSubstituteMedication = 'Select if they require any substitute medication'
    }

    if (this.body.requiresSubstituteMedication === 'yes' && !this.body.substituteMedicationDetail) {
      errors.substituteMedicationDetail = 'Enter the substitute medication they take'
    }

    if (!this.body.engagedWithDrugAndAlcoholService) {
      errors.engagedWithDrugAndAlcoholService =
        'Select if they are engaged with a drug and alcohol service, or if awaiting an assessment'
    }

    if (this.body.engagedWithDrugAndAlcoholService === 'yes' && !this.body.serviceDetails) {
      errors.serviceDetails = 'Enter the drug and alcohol service'
    }

    if (!this.body.intentToReferToService) {
      errors.intentToReferToService =
        'Select if there is an intention to refer them to a drug and alcohol service, or if they are not in prison custody'
    }

    if (!this.body.releasedWithNaloxone) {
      errors.releasedWithNaloxone =
        'Select if they are being released with naloxone, or if they are not in prison custody'
    }

    return errors
  }

  onSave(): void {
    if (this.body.substanceAndAlcoholUse !== 'yes') {
      delete this.body.substanceAndAlcoholUseDetail
    }

    if (this.body.requiresSubstituteMedication !== 'yes') {
      delete this.body.substituteMedicationDetail
    }

    if (this.body.engagedWithDrugAndAlcoholService !== 'yes') {
      delete this.body.serviceDetails
    }
  }
}
