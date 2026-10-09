import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToRadioItems } from '../../../../utils/formUtils'
import errorLookups from '../../../../i18n/en/errors.json'
import Summary, { ManualRoshData } from './summary'
import { DateFormats } from '../../../../utils/dateUtils'

export type ManualRoshBody = {
  riskToChildren: string
  riskToPublic: string
  riskToKnownAdult: string
  riskToStaff: string
  overallRisk: string
}

const applicationQuestions = getQuestions('')

export const options = applicationQuestions['risks-of-serious-harm-to-others']['manual-rosh-information']

@Page({
  name: 'manual-rosh-information',
  bodyProperties: ['riskToChildren', 'riskToPublic', 'riskToKnownAdult', 'riskToStaff', 'overallRisk', 'createdAt'],
})
export default class ManualRoshInformation implements TaskListPage {
  documentTitle = `Create a RoSH summary for this person`

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Create a RoSH summary for ${this.personName}`

  selectText = `Select the risk levels for ${this.personName} in the community.`

  body: ManualRoshBody

  questions = getQuestions(this.personName)['risks-of-serious-harm-to-others']['manual-rosh-information']

  taskName = 'risks-of-serious-harm-to-others'

  createdAt = new Date().toISOString()

  constructor(
    body: Partial<ManualRoshBody>,
    private readonly application: Application,
  ) {
    this.body = body as ManualRoshBody
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'risk-to-others'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    Object.keys(this.body).forEach(key => {
      const typedKey = key as keyof ManualRoshBody

      if (!this.body[typedKey]) {
        errors[typedKey] = errorLookups.manualRoshInformation[typedKey].empty
      }
    })

    return errors
  }

  items(fieldName: keyof ManualRoshBody) {
    const originalOptions = this.questions[fieldName].answers

    const transformedOptions = Object.fromEntries(
      Object.entries(originalOptions).map(([_key, value]) => [value, value]),
    )

    return convertKeyValuePairToRadioItems(transformedOptions, this.body[fieldName])
  }

  response() {
    // If `summary` exists on `risks-of-serious-harm-to-others` then that page
    // will correctly populate manual rosh data
    //
    // I tried just returning Summary.response() here, but found some local
    // applications where the risk information was being output twice where
    // data was input manually, but there were empty summary comments
    // perhaps where the user selected old-oasys, then changed their answer

    // handled by summary.ts
    if (this.application.data['risks-of-serious-harm-to-others']?.summary) {
      return {}
    }

    const body = this.body as ManualRoshData

    return {
      'Created by prison offender manager': DateFormats.dateObjtoUIDate(body.createdAt, { format: 'medium' }),
      'Overall risk rating': body.overallRisk,
      'Risk to children': body.riskToChildren,
      'Risk to known adult': body.riskToKnownAdult,
      'Risk to public': body.riskToPublic,
      'Risk to staff': body.riskToStaff,
    }
  }
}
