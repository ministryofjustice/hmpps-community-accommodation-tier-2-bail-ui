import type { DataServices, TaskListErrors } from '@approved-premises/ui'
import { Cas2Application as Application, Cas2OAsysRiskToSelfDto } from '@approved-premises/api'
import { Page } from '../../../../utils/decorators'
import TaskListPage from '../../../../taskListPage'
import { DateFormats } from '../../../../../utils/dateUtils'
import { nameOrPlaceholderCopy } from '../../../../../utils/utils'
import Vulnerability from '../vulnerability'
import { logOasysError } from '../../../../utils'
import OldOasys from '../oldOasys'

type GuidanceBody = Record<string, never>

export type RiskToSelfTaskData = {
  'risk-to-self': {
    'oasys-import': {
      oasysImportedDate: Date
      oasysStartedDate: string
      oasysCompletedDate: string
    }
    vulnerability: {
      vulnerabilityDetail: string
    }
    'current-and-previous-risk': {
      currentAndPreviousRiskDetail: string
    }
  }
}

@Page({
  name: 'oasys-import',
  bodyProperties: [],
})
export default class OasysImport implements TaskListPage {
  documentTitle = "Import the person's risk to self data from OASys"

  personName = nameOrPlaceholderCopy(this.application.person)

  title = `Import ${this.personName}'s risk to self data from OASys`

  body: GuidanceBody

  oasysCompleted: string

  oasysStarted: string

  hasOasysRecord: boolean

  noOasysBannerText = `No OASys record available to import for ${this.personName}`

  noOasysDescriptiveText = `No information can be imported for the risk to self section because ${this.personName} 
                            does not have a Layer 3 OASys completed in the last 6 months.`

  taskData: string

  taskName = 'risk-to-self'

  constructor(
    body: Partial<GuidanceBody>,
    private readonly application: Application,
    oasys: Cas2OAsysRiskToSelfDto,
    taskData: string,
  ) {
    this.body = body as GuidanceBody
    this.hasOasysRecord = (oasys && Boolean(Object.keys(oasys).length)) || false
    if (oasys) {
      this.oasysStarted =
        oasys.metadata.dateStarted && DateFormats.isoDateToUIDate(oasys.metadata.dateStarted, { format: 'medium' })
      this.oasysCompleted =
        oasys.metadata.dateCompleted && DateFormats.isoDateToUIDate(oasys.metadata.dateCompleted, { format: 'medium' })
    }
    this.taskData = taskData
  }

  static async initialize(
    body: Partial<GuidanceBody>,
    application: Application,
    token: string,
    dataServices: DataServices,
  ) {
    let oasys
    let taskDataJson

    if (!application.data['risk-to-self']) {
      try {
        oasys = await dataServices.personService.getOasysRiskToSelf(token, application.person.crn)

        taskDataJson = JSON.stringify(OasysImport.getTaskData(oasys))
      } catch (e) {
        logOasysError(e, application.person.crn)
        oasys = null
      }
      return new OasysImport(body, application, oasys, taskDataJson)
    }
    if (!application.data['risk-to-self']['oasys-import']) {
      return new OldOasys(application.data['risk-to-self']['old-oasys'] ?? {}, application)
    }
    return new Vulnerability(application.data['risk-to-self'].vulnerability ?? {}, application)
  }

  private static getTaskData(oasysSections: Cas2OAsysRiskToSelfDto): Partial<RiskToSelfTaskData> {
    const taskData = { 'risk-to-self': {} } as Partial<RiskToSelfTaskData>
    const today = new Date()

    taskData['risk-to-self'].vulnerability = { vulnerabilityDetail: oasysSections.analysisVulnerabilities }
    taskData['risk-to-self']['current-and-previous-risk'] = {
      currentAndPreviousRiskDetail: oasysSections.analysisSuicideSelfharm,
    }

    taskData['risk-to-self']['oasys-import'] = {
      oasysImportedDate: today,
      oasysStartedDate: oasysSections.metadata.dateStarted,
      oasysCompletedDate: oasysSections.metadata.dateCompleted,
    }
    return taskData
  }

  previous() {
    return 'taskList'
  }

  next() {
    return 'vulnerability'
  }

  errors() {
    const errors: TaskListErrors<this> = {}

    return errors
  }

  isApplicable(): boolean {
    return this.application.applicationOrigin === 'other'
  }
}
