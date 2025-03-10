import { path } from 'static-path'

const peoplePath = path('/cas2v2/people')
const personPath = peoplePath.path(':crn')
const applicationsPath = path('/cas2v2/applications')
const abandonPath = applicationsPath.path(':id').path('abandon')
const singleApplicationPath = applicationsPath.path(':id')
const singleAssessmentPath = path('/cas2v2/assessments/:id')
const submissionsPath = path('/cas2v2/submissions')
const singleSubmissionPath = submissionsPath.path(':id')
const referenceDataPath = path('/cas2v2/reference-data')
const reportsPath = path('/cas2v2/reports')
const singleReportPath = reportsPath.path(':name')

export default {
  people: {
    searchByPrisonNumber: peoplePath.path('search-by-noms/:nomsNumber'),
    searchByCrn: peoplePath.path('search-by-crn/:crn'),
    risks: {
      show: personPath.path('risks'),
    },
  },
  submissions: {
    index: submissionsPath,
    create: submissionsPath,
    show: singleSubmissionPath,
  },
  applications: {
    new: applicationsPath,
    index: applicationsPath,
    abandon: abandonPath,
    show: singleApplicationPath,
    update: singleApplicationPath,
  },
  assessments: {
    show: singleAssessmentPath,
    update: singleAssessmentPath,
    applicationNotes: {
      create: singleAssessmentPath.path('notes'),
    },
  },
  referenceData: {
    applicationStatuses: referenceDataPath.path('application-status'),
  },
  assessmentStatusUpdates: {
    create: singleAssessmentPath.path('status-updates'),
  },
  reports: {
    show: singleReportPath,
  },
}
