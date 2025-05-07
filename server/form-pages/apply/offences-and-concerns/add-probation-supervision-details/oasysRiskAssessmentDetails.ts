/* eslint-disable no-param-reassign */
import { Radio, TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { getQuestions } from '../../../utils/questions'
import { convertKeyValuePairToCheckboxItems } from '../../../../utils/formUtils'

const riskLevels: Record<string, unknown> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
  veryHigh: 'Very high risk',
}

const inTheCommunityOptions =
  getQuestions('')['add-probation-supervision-details']['oasys-risk-assessment-details'].inTheCommunity.answers

export type InTheCommunityOptions = keyof typeof inTheCommunityOptions

const inCustodyOptions =
  getQuestions('')['add-probation-supervision-details']['oasys-risk-assessment-details'].inCustody.answers

export type InCustodyOptions = keyof typeof inCustodyOptions

export type OASysRiskAssessmentDetailsBody = {
  inTheCommunity: Array<InTheCommunityOptions>
  inCustody: Array<InCustodyOptions>
  inTheCommunityChildrenRisk: string
  inTheCommunityPublicRisk: string
  inTheCommunityKnownAdultRisk: string
  inCustodyPublicRisk: string
  inCustodyKnownAdultRisk: string
  inCustodyStaffRisk: string
  inCustodyPrisonersRisk: string
}

@Page({
  name: 'oasys-risk-assessment-details',
  bodyProperties: [
    'inTheCommunity',
    'inCustody',
    'inTheCommunityChildrenRisk',
    'inTheCommunityPublicRisk',
    'inTheCommunityKnownAdultRisk',
    'inCustodyPublicRisk',
    'inCustodyKnownAdultRisk',
    'inCustodyStaffRisk',
    'inCustodyPrisonersRisk',
  ],
})
export default class OASysRiskAssessmentDetails implements TaskListPage {
  documentTitle = 'Provide details of the OASys assessment'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = 'Provide details of the OASys assessment'

  questions = getQuestions(this.personName)['add-probation-supervision-details']['oasys-risk-assessment-details']

  body: OASysRiskAssessmentDetailsBody

  constructor(
    body: Partial<OASysRiskAssessmentDetailsBody>,
    private readonly application: Application,
  ) {
    this.body = body as OASysRiskAssessmentDetailsBody
  }

  previous() {
    return 'contacted-cpp-about-current-risk-levels'
  }

  next() {
    return ''
  }

  itemsForInTheCommunity(childrenRiskHtml: string, publicRiskHtml: string, knownAdultRiskHtml: string) {
    const items = convertKeyValuePairToCheckboxItems(inTheCommunityOptions, this.body.inTheCommunity) as [Radio]

    items.forEach(item => {
      if (item.value === 'children') {
        item.attributes = { 'data-testid': 'inTheCommunityChildren' }
        item.conditional = { html: childrenRiskHtml }
      }
      if (item.value === 'public') {
        item.attributes = { 'data-testid': 'inTheCommunityPublic' }
        item.conditional = { html: publicRiskHtml }
      }
      if (item.value === 'knownAdult') {
        item.attributes = { 'data-testid': 'inTheCommunityKnownAdult' }
        item.conditional = { html: knownAdultRiskHtml }
      }
    })

    return items
  }

  itemsForInCustody(
    prisonerRiskHtml: string,
    staffRiskHtml: string,
    publicRiskHtml: string,
    knownAdultRiskHtml: string,
  ) {
    const items = convertKeyValuePairToCheckboxItems(inCustodyOptions, this.body.inCustody) as [Radio]

    items.forEach(item => {
      if (item.value === 'prisoners') {
        item.attributes = { 'data-testid': 'inCustodyPrisoners' }
        item.conditional = { html: prisonerRiskHtml }
      }
      if (item.value === 'staff') {
        item.attributes = { 'data-testid': 'inCustodyStaff' }
        item.conditional = { html: staffRiskHtml }
      }
      if (item.value === 'public') {
        item.attributes = { 'data-testid': 'inCustodyPublic' }
        item.conditional = { html: publicRiskHtml }
      }
      if (item.value === 'knownAdult') {
        item.attributes = { 'data-testid': 'inCustodyKnownAdult' }
        item.conditional = { html: knownAdultRiskHtml }
      }
    })

    return items
  }

  itemsForOASysRiskQuestions(fieldName: keyof OASysRiskAssessmentDetailsBody) {
    return Object.keys(riskLevels).map(riskLevelKey => ({
      value: riskLevelKey,
      text: riskLevels[riskLevelKey],
      attributes: {
        'data-testid': `${fieldName}-${riskLevelKey}`,
      },
    }))
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    const riskLevelErrorMessage = 'Select if the risk is low, medium, high or very high'

    if (!this.body.inTheCommunity) {
      errors.inTheCommunity = 'Select if they are a risk to anyone in the community'
    } else {
      if (this.body.inTheCommunity.includes('children') && !this.body.inTheCommunityChildrenRisk) {
        errors.inTheCommunityChildrenRisk = riskLevelErrorMessage
      }
      if (this.body.inTheCommunity.includes('public') && !this.body.inTheCommunityPublicRisk) {
        errors.inTheCommunityPublicRisk = riskLevelErrorMessage
      }
      if (this.body.inTheCommunity.includes('knownAdult') && !this.body.inTheCommunityKnownAdultRisk) {
        errors.inTheCommunityKnownAdultRisk = riskLevelErrorMessage
      }
    }

    if (!this.body.inCustody) {
      errors.inCustody = 'Select if they are a risk to anyone in custody'
    } else {
      if (this.body.inCustody.includes('public') && !this.body.inCustodyPublicRisk) {
        errors.inCustodyPublicRisk = riskLevelErrorMessage
      }
      if (this.body.inCustody.includes('prisoners') && !this.body.inCustodyPrisonersRisk) {
        errors.inCustodyPrisonersRisk = riskLevelErrorMessage
      }
      if (this.body.inCustody.includes('knownAdult') && !this.body.inCustodyKnownAdultRisk) {
        errors.inCustodyKnownAdultRisk = riskLevelErrorMessage
      }
      if (this.body.inCustody.includes('staff') && !this.body.inCustodyStaffRisk) {
        errors.inCustodyStaffRisk = riskLevelErrorMessage
      }
    }

    return errors
  }

  onSave() {
    if (!this.body.inTheCommunity.includes('children')) {
      delete this.body.inTheCommunityChildrenRisk
    }
    if (!this.body.inTheCommunity.includes('public')) {
      delete this.body.inTheCommunityPublicRisk
    }
    if (!this.body.inTheCommunity.includes('knownAdult')) {
      delete this.body.inTheCommunityKnownAdultRisk
    }

    if (!this.body.inCustody.includes('public')) {
      delete this.body.inCustodyPublicRisk
    }
    if (!this.body.inCustody.includes('prisoners')) {
      delete this.body.inCustodyPrisonersRisk
    }
    if (!this.body.inCustody.includes('knownAdult')) {
      delete this.body.inCustodyKnownAdultRisk
    }
    if (!this.body.inCustody.includes('staff')) {
      delete this.body.inCustodyStaffRisk
    }
  }
}
