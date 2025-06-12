import { path } from 'static-path'

const applicationsPath = path('/applications')
const singleApplicationPath = applicationsPath.path(':id')
const pagesPath = singleApplicationPath.path('tasks/:task/pages/:page')
const peoplePath = applicationsPath.path('people')

const appendToListPath = pagesPath.path('/appendToList')

const removeFromListPath = pagesPath.path(':index/removeFromList')

const prisonDashboardPath = applicationsPath.path('prison')

const paths = {
  applications: {
    create: applicationsPath.path('create'),
    index: applicationsPath,
    prison: prisonDashboardPath,
    searchByPrisonNumber: applicationsPath.path('search-by-prison-number'),
    searchByCrn: applicationsPath.path('search-by-crn'),
    unauthorisedCourtBailApplication: applicationsPath.path('unauthorised-court-bail-application'),
    unauthorisedPrisonBailApplication: applicationsPath.path('unauthorised-prison-bail-application'),
    beforeYouStart: applicationsPath.path('before-you-start'),
    applicationOrigin: applicationsPath.path('application-type'),
    selectApplicationOrigin: applicationsPath.path('select-application-origin'),
    people: {
      findByPrisonNumber: peoplePath.path('find-by-prison-number'),
      findByCrn: peoplePath.path('find-by-crn'),
    },
    show: singleApplicationPath,
    overview: singleApplicationPath.path('overview'),
    submission: singleApplicationPath.path('submission'),
    confirmSubmission: singleApplicationPath.path('confirm-submission'),
    pages: {
      show: pagesPath,
      update: pagesPath,
    },
    update: singleApplicationPath,
    appendToList: appendToListPath,
    removeFromList: removeFromListPath,
    ineligible: singleApplicationPath.path('not-eligible'),
    addNote: singleApplicationPath.path('add-note'),
    cancel: singleApplicationPath.path('cancel'),
  },
}

export default paths
