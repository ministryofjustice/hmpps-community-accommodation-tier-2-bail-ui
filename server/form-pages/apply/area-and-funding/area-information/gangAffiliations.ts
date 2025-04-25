import { Cas2v2Application as Application } from '@approved-premises/api'
import { TaskListErrors, YesNoOrDontKnow } from '@approved-premises/ui'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { getQuestions } from '../../../utils/questions'

export type GangAffiliationsBody = {
  hasGangAffiliations: YesNoOrDontKnow
  gangDetails: string
  gangNotKnownDetails: string
  rivalGangsOrCountyLines: YesNoOrDontKnow
  rivalGangsOrCountyLinesDetail: string
  rivalGangNotKnownDetail: string
}

@Page({
  name: 'gang-affiliations',
  bodyProperties: [
    'hasGangAffiliations',
    'gangDetails',
    'gangNotKnownDetails',
    'rivalGangsOrCountyLines',
    'rivalGangsOrCountyLinesDetail',
    'rivalGangNotKnownDetail',
  ],
})
export default class GangAffiliations implements TaskListPage {
  documentTitle = 'Does the person have any gang affiliations?'

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Does ${nameOrPlaceholderCopy(this.application.person)} have any gang affiliations?`

  questions = getQuestions(this.personName)['area-information']['gang-affiliations']

  body: GangAffiliationsBody

  constructor(
    body: Partial<GangAffiliationsBody>,
    private readonly application: Application,
  ) {
    this.body = body as GangAffiliationsBody
  }

  previous() {
    return 'exclusion-zones'
  }

  next() {
    return 'family-accommodation'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.body.hasGangAffiliations) {
      errors.hasGangAffiliations = 'Select if they have any gang affiliations, or it is not known'
    }

    if (!this.body.rivalGangsOrCountyLines) {
      errors.rivalGangsOrCountyLines = 'Select if there are any rival gangs or county lines, or it is not known'
    }

    if (this.body.hasGangAffiliations === 'yes' && !this.body.gangDetails) {
      errors.gangDetails = `Enter details of the gang`
    }

    if (this.body.hasGangAffiliations === 'dontKnow' && !this.body.gangNotKnownDetails) {
      errors.gangNotKnownDetails = `Enter why it is not known`
    }

    if (this.body.rivalGangsOrCountyLines === 'dontKnow' && !this.body.rivalGangNotKnownDetail) {
      errors.rivalGangNotKnownDetail = `Enter why it is not known`
    }

    return errors
  }

  onSave(): void {
    if (this.body.hasGangAffiliations !== 'yes') {
      delete this.body.gangDetails
    }
    if (this.body.hasGangAffiliations !== 'dontKnow') {
      delete this.body.gangNotKnownDetails
    }
    if (this.body.rivalGangsOrCountyLines !== 'yes') {
      delete this.body.rivalGangsOrCountyLinesDetail
    }
    if (this.body.rivalGangsOrCountyLines !== 'dontKnow') {
      delete this.body.rivalGangNotKnownDetail
    }
  }
}
