import { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'

export type SeriousHarmRiskLevelsBody = {
  riskToChildren: string
  riskToPublic: string
  riskToKnownAdults: string
  riskToStaff: string
  overallRiskLevel: string
}

type SeriousHarmRiskLevelsBodyKey = keyof SeriousHarmRiskLevelsBody

@Page({
  name: 'serious-harm-risk-levels',
  bodyProperties: ['riskToChildren', 'riskToPublic', 'riskToKnownAdults', 'riskToStaff', 'overallRiskLevel'],
})
export default class SeriousHarmRiskLevels implements TaskListPage {
  documentTitle = 'Confirm the current risk levels as discussed with the CPP'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Confirm the current risk levels as discussed with the CPP'

  questions = getQuestions(this.personName)['add-probation-supervision-details']['serious-harm-risk-levels']

  body: SeriousHarmRiskLevelsBody

  constructor(
    body: Partial<SeriousHarmRiskLevelsBody>,
    private readonly application: Application,
  ) {
    this.body = body as SeriousHarmRiskLevelsBody
  }

  previous() {
    return 'contacted-cpp-about-current-risk-levels'
  }

  next() {
    return ''
  }

  items(category: SeriousHarmRiskLevelsBodyKey) {
    return convertKeyValuePairToRadioItems(this.questions[category].answers, this.body[category]) as Array<Radio>
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.overallRiskLevel) {
      errors.overallRiskLevel = 'Select their overall risk level'
    }
    if (!this.body.riskToChildren) {
      errors.riskToChildren = 'Select their level of risk to children'
    }
    if (!this.body.riskToKnownAdults) {
      errors.riskToKnownAdults = 'Select their level of risk to known adults'
    }
    if (!this.body.riskToPublic) {
      errors.riskToPublic = 'Select their level of risk to the public'
    }
    if (!this.body.riskToStaff) {
      errors.riskToStaff = 'Select their level of risk to staff'
    }

    return errors
  }
}
