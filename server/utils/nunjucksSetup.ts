/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { ErrorMessages, PersonStatus } from '@approved-premises/ui'
import { initialiseName, removeBlankSummaryListItems, stringToKebabCase, camelToKebabCase } from './utils'
import config from '../config'
import logger from '../../logger'
import applicationPaths from '../paths/apply'
import assessPaths from '../paths/assess'
import reportPaths from '../paths/report'
import staticPaths from '../paths/static'
import {
  documentSummaryListRows,
  inProgressApplicationTableRows,
  submittedApplicationTableRows,
  assessmentsTableRows,
  arePreTaskListTasksIncomplete,
  prisonApplicationTableRows,
  unspentConvictionsCardRows,
} from './applicationUtils'
import {
  getApplicationTimelineEvents,
  getSideNavLinksForApplication,
  getSideNavLinksForDocument,
} from './applications/utils'
import { applicationStatusRadios, applicationStatusDetailOptions } from './assessUtils'
import { checkYourAnswersSections, getApplicantDetails } from './checkYourAnswersUtils'
import { DateFormats } from './dateUtils'
import { dateFieldValues } from './formUtils'
import { statusTag } from './personUtils'
import * as TaskListUtils from './taskListUtils'
import { pagination } from './pagination'
import { formatLines } from './viewUtils'
import * as PhaseBannerUtils from './phaseBannerUtils'

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.applicationName = 'Short-Term Accommodation (CAS2) for bail'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'preprod' ? 'govuk-tag--green' : ''
  let assetManifest: Record<string, string> = {}

  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(e, 'Could not read file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)

  njkEnv.addGlobal('fetchContext', function fetchContext() {
    return this.ctx
  })

  njkEnv.addGlobal('mergeObjects', (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
    return { ...obj1, ...obj2 }
  })

  njkEnv.addGlobal('paths', { ...applicationPaths, ...assessPaths, ...reportPaths, ...staticPaths })
  njkEnv.addGlobal('TaskListUtils', TaskListUtils)

  njkEnv.addGlobal('inProgressApplicationTableRows', inProgressApplicationTableRows)
  njkEnv.addGlobal('submittedApplicationTableRows', submittedApplicationTableRows)
  njkEnv.addGlobal('assessmentsTableRows', assessmentsTableRows)
  njkEnv.addGlobal('documentSummaryListRows', documentSummaryListRows)
  njkEnv.addGlobal('prisonApplicationTableRows', prisonApplicationTableRows)

  njkEnv.addGlobal('dateFieldValues', function sendContextToDateFieldValues(fieldName: string, errors: ErrorMessages) {
    return dateFieldValues(fieldName, this.ctx, errors)
  })
  njkEnv.addGlobal('formatDate', DateFormats.isoDateToUIDate)

  njkEnv.addGlobal('checkYourAnswersSections', checkYourAnswersSections)
  njkEnv.addGlobal('getApplicantDetails', getApplicantDetails)

  njkEnv.addGlobal('getApplicationTimelineEvents', getApplicationTimelineEvents)
  njkEnv.addGlobal('applicationStatusRadios', applicationStatusRadios)
  njkEnv.addGlobal('applicationStatusDetailOptions', applicationStatusDetailOptions)

  njkEnv.addFilter('removeBlankSummaryListItems', removeBlankSummaryListItems)
  njkEnv.addFilter('formatLines', formatLines)

  const markAsSafe = (html: string): string => {
    const safeFilter = njkEnv.getFilter('safe')
    return safeFilter(html)
  }

  njkEnv.addGlobal('statusTag', (status: PersonStatus) => markAsSafe(statusTag(status)))
  njkEnv.addGlobal('getSideNavLinksForDocument', getSideNavLinksForDocument)
  njkEnv.addGlobal('getSideNavLinksForApplication', getSideNavLinksForApplication)
  njkEnv.addGlobal('stringToKebabCase', stringToKebabCase)
  njkEnv.addGlobal('camelToKebabCase', camelToKebabCase)

  njkEnv.addGlobal('pagination', pagination)

  njkEnv.addGlobal('arePreTaskListTasksIncomplete', arePreTaskListTasksIncomplete)
  njkEnv.addGlobal('PhaseBannerUtils', PhaseBannerUtils)

  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)

  njkEnv.addGlobal('unspentConvictionsCardRows', unspentConvictionsCardRows)
}
