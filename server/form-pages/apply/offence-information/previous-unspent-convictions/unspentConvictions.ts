import type { TaskListErrors } from '@approved-premises/ui'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import UnspentConvictionsData, { UnspentConvictionsDataBody } from './custom-forms/unspentConvictionsData'
import { createQueryString, nameOrPlaceholderCopy } from '../../../../utils/utils'
import paths from '../../../../paths/apply'
import { getQuestions } from '../../../utils/questions'

type UnspentConvictionsBody = { convictionsList: string }

type UnspentConvictionsUI = {
  convictionTypeTag: string
  convictionTypeText: string
  numberOfConvictions: string
  currentlyServing: string
  safeguarding: string
  removeLink: string
}

@Page({
  name: 'unspent-convictions',
  bodyProperties: [''],
})
export default class UnspentConvictions implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = `View and add the applicant's previous unspent convictions`

  title = `View and add ${this.personName}'s previous unspent convictions`

  body: UnspentConvictionsBody

  unspentConvictions: UnspentConvictionsUI[]

  pageName = 'unspent-convictions'

  dataPageName = 'unspent-convictions-data'

  taskName = 'previous-unspent-convictions'

  convictionTypes = getQuestions('')['previous-unspent-convictions']['unspent-convictions-data'].convictionType.answers

  constructor(
    body: Partial<UnspentConvictionsBody>,
    private readonly application: Application,
  ) {
    if (application.data[this.taskName]?.[this.dataPageName]) {
      const unspentConvictionsData = application.data[this.taskName][this.dataPageName] as [UnspentConvictionsDataBody]

      const query = {
        redirectPage: this.pageName,
      }

      this.unspentConvictions = unspentConvictionsData
        .filter(unspentConviction => unspentConviction.numberOfConvictions)
        .map((unspentConviction, index) => {
          const convictionTypeText =
            this.convictionTypes[unspentConviction.convictionType as keyof typeof this.convictionTypes]

          return {
            convictionTypeTag: this.getOffenceCategoryTag(unspentConviction.convictionType, convictionTypeText),
            convictionTypeText,
            numberOfConvictions: unspentConviction.numberOfConvictions,
            currentlyServing: this.getCurrentlyServingAnswer(unspentConviction.currentlyServing),
            safeguarding: this.getSafeguardingAnswer(unspentConviction),
            removeLink: `${paths.applications.removeFromList({
              id: application.id,
              task: this.taskName,
              page: this.dataPageName,
              index: index.toString(),
            })}?${createQueryString(query)}`,
          }
        })
    }
    this.body = body as UnspentConvictionsBody
  }

  static async initialize(body: Partial<UnspentConvictionsDataBody>, application: Application) {
    if (!application.data['previous-unspent-convictions']?.['unspent-convictions-data']) {
      return new UnspentConvictionsData(body, application)
    }
    return new UnspentConvictions({}, application)
  }

  previous() {
    return 'any-previous-convictions'
  }

  next() {
    return ''
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    if (!this.application.data['unspent-convictions']?.['unspent-convictions-data'].length) {
      errors.convictionsList = 'Unspent convictions must be added to the application'
    }

    return errors
  }

  response() {
    const response: Record<string, string> = {}

    this.unspentConvictions?.forEach(unspentConviction => {
      const { convictionTypeTag, numberOfConvictions, currentlyServing, safeguarding } = unspentConviction

      const unspentConvictionString = `Number of convictions: ${numberOfConvictions}\r\nActive sentence: ${currentlyServing}\r\nSafeguarding: ${safeguarding}`
      response[convictionTypeTag] = unspentConvictionString
    })

    return response
  }

  getOffenceCategoryTag(convictionType: string, convictionTypeText: string) {
    return `<strong class="govuk-tag govuk-tag--${this.getOffenceTagColour(
      convictionType,
    )}">${convictionTypeText}</strong><p class="govuk-visually-hidden">conviction information</p>`
  }

  getOffenceTagColour(convictionType: string) {
    switch (convictionType) {
      case 'stalkingOrHarassment':
        return 'blue'
      case 'weaponsOrFirearms':
        return 'red'
      case 'arson':
        return 'yellow'
      case 'violence':
        return 'pink'
      case 'domesticAbuse':
        return 'purple'
      case 'hateCrime':
        return 'green'
      case 'drugs':
        return 'custom-brown'
      default:
        return 'grey'
    }
  }

  getSafeguardingAnswer(unspentConviction: UnspentConvictionsDataBody): string {
    if (!unspentConviction.safeguardingDetail) {
      return 'No'
    }

    return unspentConviction.safeguardingDetail
  }

  getCurrentlyServingAnswer(answer: Pick<UnspentConvictionsDataBody, 'currentlyServing'>['currentlyServing']): string {
    if (answer === 'yes') {
      return 'Yes'
    }

    return 'No'
  }
}
