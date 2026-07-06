import type { DataServices, OASysRiskOfSeriousHarm, RoshRisksEnvelope, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application } from '@approved-premises/api'
import { Page } from '../../../utils/decorators'
import TaskListPage from '../../../taskListPage'
import { nameOrPlaceholderCopy } from '../../../../utils/utils'
import { DateFormats } from '../../../../utils/dateUtils'
import Summary, { SummaryData } from './summary'
import { logOasysError } from '../../../utils'
import OldOasys from './oldOasys'

type OasysImportBody = Record<string, never>

export type RoshTaskData = {
  'risks-of-serious-harm-to-others': {
    'oasys-import': {
      oasysImportedDate: Date
    }
    summary: RoshRisksEnvelope & {
      oasysImportedDate: Date
    }
    'summary-data'?: SummaryData
    'risk-to-others': {
      whoIsAtRisk: string
      natureOfRisk: string
    }
  }
}

@Page({
  name: 'oasys-import',
  bodyProperties: [],
})
export default class OasysImport implements TaskListPage {
  personName = nameOrPlaceholderCopy(this.application.person)

  documentTitle = "Import the person's risk of serious harm (RoSH) data from OASys"

  title = `Import ${nameOrPlaceholderCopy(this.application.person)}'s risk of serious harm (RoSH) data from OASys`

  body: OasysImportBody

  taskData: string

  hasOasysRecord: boolean

  oasysCompleted: string

  oasysStarted: string

  noOasysBannerText = `No OASys record available to import for ${this.personName}`

  noOasysDescriptiveText = `No information can be imported for the Risk of Serious Harm (RoSH) section because ${this.personName}
                            does not have a Layer 3 OASys completed in the last 6 months.`

  taskName = 'risks-of-serious-harm-to-others'

  constructor(
    body: Partial<OasysImportBody>,
    private readonly application: Application,
    oasys: OASysRiskOfSeriousHarm,
    taskData: string,
  ) {
    this.body = body as OasysImportBody
    this.hasOasysRecord = (oasys && Boolean(Object.keys(oasys).length)) || false
    if (this.hasOasysRecord) {
      this.oasysStarted = oasys.dateStarted && DateFormats.isoDateToUIDate(oasys.dateStarted, { format: 'medium' })
      this.oasysCompleted =
        oasys.dateCompleted && DateFormats.isoDateToUIDate(oasys.dateCompleted, { format: 'medium' })
    }
    this.taskData = taskData
  }

  static async initialize(
    body: Partial<OasysImportBody>,
    application: Application,
    request: { user: { token: string; username: string } },
    dataServices: DataServices,
  ) {
    let oasys: OASysRiskOfSeriousHarm
    let risks: RoshRisksEnvelope
    let taskDataJson

    if (!application.data['risks-of-serious-harm-to-others']) {
      try {
        oasys = await dataServices.personService.getOasysRosh(request.user.token, application.person.crn)
        risks = await dataServices.personService.getRoshRisks(request.user.token, application.person.crn)
        taskDataJson = JSON.stringify(OasysImport.getTaskData(oasys, risks))
      } catch (e) {
        logOasysError(e, application.person.crn)
        oasys = null
      }
      return new OasysImport(body, application, oasys, taskDataJson)
    }
    if (OasysImport.isRoshApplicationDataImportedFromOASys(application)) {
      return new Summary(application.data['risks-of-serious-harm-to-others'].summary ?? {}, application)
    }
    return new OldOasys(application.data['risks-of-serious-harm-to-others']['old-oasys'] ?? {}, application)
  }

  private static isRoshApplicationDataImportedFromOASys(application: Application): boolean {
    const rosh = application.data['risks-of-serious-harm-to-others']
    if (rosh?.['oasys-import']?.oasysImportedDate) {
      return true
    }
    return false
  }

  private static getTaskData(oasysSections: OASysRiskOfSeriousHarm, risks: RoshRisksEnvelope): Partial<RoshTaskData> {
    const taskData = { 'risks-of-serious-harm-to-others': { summary: {} } } as Partial<RoshTaskData>

    const today = new Date()

    taskData['risks-of-serious-harm-to-others']['summary-data'] = {
      ...risks,
      oasysImportedDate: today,
      oasysStartedDate: oasysSections.dateStarted,
      oasysCompletedDate: oasysSections.dateCompleted,
    } as SummaryData

    oasysSections.rosh.forEach(question => {
      switch (question.questionNumber) {
        case 'R10.1':
          taskData['risks-of-serious-harm-to-others']['risk-to-others'] = {
            ...taskData['risks-of-serious-harm-to-others']['risk-to-others'],
            whoIsAtRisk: question.answer,
          }
          break
        case 'R10.2':
          taskData['risks-of-serious-harm-to-others']['risk-to-others'] = {
            ...taskData['risks-of-serious-harm-to-others']['risk-to-others'],
            natureOfRisk: question.answer,
          }
          break
        default:
          break
      }
    })

    taskData['risks-of-serious-harm-to-others']['oasys-import'] = { oasysImportedDate: today }

    return taskData
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'summary'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  isApplicable() {
    return this.application.applicationOrigin === 'other'
  }
}
