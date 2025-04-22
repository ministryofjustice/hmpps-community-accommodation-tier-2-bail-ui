import type { NextFunction, Request, Response } from 'express'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { Cas2v2Application as Application } from '@approved-premises/api'
import { ApplicationOrigin, ErrorsAndUserInput, GroupedApplications } from '@approved-premises/ui'
import createHttpError from 'http-errors'

import { getPage } from '../../utils/applications/getPage'
import TaskListPage from '../../form-pages/taskListPage'
import {
  applicationFactory,
  applicationSummaryFactory,
  personFactory,
  applicationNoteFactory,
} from '../../testutils/factories'
import {
  addErrorMessagesToFlash,
  catchValidationErrorOrPropogate,
  fetchErrorsAndUserInput,
} from '../../utils/validation'
import ApplicationsController from './applicationsController'
import { PersonService, ApplicationService, SubmittedApplicationService } from '../../services'
import paths from '../../paths/apply'
import { buildDocument } from '../../utils/applications/documentUtils'
import config from '../../config'
import { showMissingRequiredTasksOrTaskList, generateSuccessMessage } from '../../utils/applications/utils'
import { validateReferer } from '../../utils/viewUtils'

jest.mock('../../utils/validation')
jest.mock('../../services/taskListService')
jest.mock('../../utils/applications/getPage')
jest.mock('../../utils/applications/documentUtils')
jest.mock('../../utils/applications/utils')
jest.mock('../../utils/viewUtils')
jest.mock('../../utils/getPaginationDetails')

describe('applicationsController', () => {
  const token = 'SOME_TOKEN'

  let request: DeepMocked<Request> = createMock<Request>({ user: { token } })
  let response: DeepMocked<Response> = createMock<Response>({})
  const next: DeepMocked<NextFunction> = jest.fn()

  const personService = createMock<PersonService>({})
  const applicationService = createMock<ApplicationService>({})
  const submittedApplicationService = createMock<SubmittedApplicationService>({})

  let applicationsController: ApplicationsController

  const applications = { inProgress: applicationSummaryFactory.buildList(3), submitted: [] } as GroupedApplications

  applicationService.getAllForLoggedInUser.mockResolvedValue(applications)

  beforeEach(() => {
    applicationsController = new ApplicationsController(
      personService,
      applicationService,
      submittedApplicationService,
      {
        personService,
        applicationService,
      },
    )

    request = createMock<Request>({
      user: { token },
      headers: {
        referer: 'some-referer/',
      },
    })
    response = createMock<Response>({})
  })

  describe('index', () => {
    it('renders existing applications', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      const requestHandler = applicationsController.index()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/index', {
        errors: {},
        errorSummary: [],
        applications,
        pageHeading: 'Applications',
      })
    })
  })

  describe('show', () => {
    describe('when application is submitted', () => {
      it('renders the submitted view', async () => {
        const submittedApplication = applicationFactory.build({ submittedAt: new Date().toISOString() })
        applicationService.findApplication.mockResolvedValue(submittedApplication)

        const requestHandler = applicationsController.show()
        await requestHandler(request, response, next)

        expect(response.render).toHaveBeenCalledWith('applications/show', {
          application: submittedApplication,
        })
      })
    })

    describe('when application is not submitted', () => {
      it('calls showMissingRequiredTasksOrTaskList', async () => {
        ;(showMissingRequiredTasksOrTaskList as jest.Mock).mockImplementation(jest.fn())
        const unsubmittedApplication = applicationFactory.build({})
        applicationService.findApplication.mockResolvedValue(unsubmittedApplication)

        const requestHandler = applicationsController.show()
        await requestHandler(request, response, next)

        expect(showMissingRequiredTasksOrTaskList).toHaveBeenCalledWith(request, response, unsubmittedApplication)
      })
    })
  })

  describe('overview', () => {
    const priorConfigFlags = config.flags

    afterAll(() => {
      config.flags = priorConfigFlags
    })

    const submittedApplication = applicationFactory.build({
      person: personFactory.build({ name: 'Roger Smith' }),
      submittedAt: '2024-02-05',
    })

    it('renders the overview page', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      applicationService.findApplication.mockResolvedValue(submittedApplication)

      const requestHandler = applicationsController.overview()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/overview', {
        application: submittedApplication,
        status: 'Received',
        pageHeading: 'Overview of application',
        errors: {},
        errorSummary: [],
      })
    })

    it('redirects to application show page if application has not been submitted', async () => {
      const application = applicationFactory.build({
        person: personFactory.build({ name: 'Roger Smith' }),
      })

      applicationService.findApplication.mockResolvedValue(application)

      const requestHandler = applicationsController.overview()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(
        paths.applications.show({
          id: application.id,
        }),
      )
    })
  })

  describe('ineligible', () => {
    it('renders the ineligible page', async () => {
      const application = applicationFactory.build({
        person: personFactory.build({ name: 'Roger Smith' }),
      })

      const panelText = `Roger Smith is not eligible for CAS-2 accommodation`
      const changeAnswerPath = paths.applications.pages.show({
        id: application.id,
        task: 'confirm-eligibility',
        page: 'confirm-eligibility',
      })
      const newApplicationPath = paths.applications.applicationOrigin({})

      applicationService.findApplication.mockResolvedValue(application)

      const requestHandler = applicationsController.ineligible()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/ineligible', {
        application,
        panelText,
        changeAnswerPath,
        newApplicationPath,
      })
    })
  })

  describe('consentRefused', () => {
    it('renders the consent refused page', async () => {
      ;(validateReferer as jest.MockedFunction<typeof validateReferer>).mockReturnValue('some-validated-referer')
      const application = applicationFactory.build({
        person: personFactory.build({ name: 'Roger Smith' }),
      })

      const panelText = `Roger Smith has not given their consent`
      const changeAnswerPath = paths.applications.pages.show({
        id: application.id,
        task: 'confirm-consent',
        page: 'confirm-consent',
      })
      const newApplicationPath = paths.applications.applicationOrigin({})

      applicationService.findApplication.mockResolvedValue(application)

      const requestHandler = applicationsController.consentRefused()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/consent-refused', {
        application,
        panelText,
        changeAnswerPath,
        newApplicationPath,
        backLink: 'some-validated-referer',
      })
      expect(validateReferer).toHaveBeenCalledWith('some-referer/')
    })
  })

  describe('create', () => {
    it('redirects to the new applications page on success', async () => {
      request.body = {
        crn: 'crn123',
        prisonNumber: 'prisonNumber123',
        applicationOrigin: 'prisonBail' as ApplicationOrigin,
      }

      applicationService.createApplication.mockResolvedValue({ id: 'application-id' } as Application)

      const requestHandler = applicationsController.create()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.show({ id: 'application-id' }))
    })

    describe('when an error occurs', () => {
      describe('when the applicationOrigin is not known', () => {
        it('redirects to the application origin page', async () => {
          request.body = {
            crn: 'crn123',
            prisonNumber: 'prisonNumber123',
            applicationOrigin: null,
          }

          const requestHandler = applicationsController.create()

          const err = createHttpError(500)

          applicationService.createApplication.mockImplementation(() => {
            throw err
          })

          await requestHandler(request, response, next)

          expect(addErrorMessagesToFlash).toHaveBeenCalledWith(
            request,
            'applicationOrigin',
            'There was an error creating the application, please try again.',
          )

          expect(response.redirect).toHaveBeenCalledWith(paths.applications.applicationOrigin({}))
        })
      })
      describe('when the applicationOrigin is "prisonBail"', () => {
        it('handles a not found error if person not found', async () => {
          request.body = {
            crn: 'crn123',
            prisonNumber: 'prisonNumber123',
            applicationOrigin: 'prisonBail' as ApplicationOrigin,
          }

          const requestHandler = applicationsController.create()

          const err = createHttpError(404)

          applicationService.createApplication.mockImplementation(() => {
            throw err
          })

          await requestHandler(request, response, next)

          expect(addErrorMessagesToFlash).toHaveBeenCalledWith(
            request,
            'prisonNumber',
            'No person found for prison number prisonNumber123, please try another number.',
          )

          expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByPrisonNumber({}))
        })

        it('handles a forbidden error if person forbidden', async () => {
          request.body = {
            crn: 'crn123',
            prisonNumber: 'prisonNumber123',
            applicationOrigin: 'prisonBail' as ApplicationOrigin,
          }

          const requestHandler = applicationsController.create()

          const err = createHttpError(403)

          applicationService.createApplication.mockImplementation(() => {
            throw err
          })

          await requestHandler(request, response, next)

          expect(addErrorMessagesToFlash).toHaveBeenCalledWith(
            request,
            'prisonNumber',
            'You do not have permission to access the prison number prisonNumber123, please try another number.',
          )

          expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByPrisonNumber({}))
        })

        it('throws a generic error if createApplication returns server error', async () => {
          request.body = {
            crn: 'crn123',
            prisonNumber: 'prisonNumber123',
            applicationOrigin: 'prisonBail' as ApplicationOrigin,
          }

          const requestHandler = applicationsController.create()

          const err = createHttpError(500)

          applicationService.createApplication.mockImplementation(() => {
            throw err
          })

          await requestHandler(request, response, next)

          expect(addErrorMessagesToFlash).toHaveBeenCalledWith(
            request,
            'prisonNumber',
            'There was an error creating the application, please try again.',
          )

          expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByPrisonNumber({}))
        })
      })

      describe('when the applicationOrigin is "courtBail"', () => {
        it('handles a not found error if person not found', async () => {
          request.body = {
            crn: 'crn123',
            prisonNumber: 'prisonNumber123',
            applicationOrigin: 'courtBail' as ApplicationOrigin,
          }

          const requestHandler = applicationsController.create()

          const err = createHttpError(404)

          applicationService.createApplication.mockImplementation(() => {
            throw err
          })

          await requestHandler(request, response, next)

          expect(addErrorMessagesToFlash).toHaveBeenCalledWith(
            request,
            'crn',
            'No person found for CRN crn123, please try another number.',
          )

          expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByCrn({}))
        })

        it('handles a forbidden error if person forbidden', async () => {
          request.body = {
            crn: 'crn123',
            prisonNumber: 'prisonNumber123',
            applicationOrigin: 'courtBail' as ApplicationOrigin,
          }

          const requestHandler = applicationsController.create()

          const err = createHttpError(403)

          applicationService.createApplication.mockImplementation(() => {
            throw err
          })

          await requestHandler(request, response, next)

          expect(addErrorMessagesToFlash).toHaveBeenCalledWith(
            request,
            'crn',
            'You do not have permission to access the CRN crn123, please try another number.',
          )

          expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByCrn({}))
        })

        it('throws a generic error if createApplication returns server error', async () => {
          request.body = {
            crn: 'crn123',
            prisonNumber: 'prisonNumber123',
            applicationOrigin: 'courtBail' as ApplicationOrigin,
          }

          const requestHandler = applicationsController.create()

          const err = createHttpError(500)

          applicationService.createApplication.mockImplementation(() => {
            throw err
          })

          await requestHandler(request, response, next)

          expect(addErrorMessagesToFlash).toHaveBeenCalledWith(
            request,
            'crn',
            'There was an error creating the application, please try again.',
          )

          expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByCrn({}))
        })
      })
    })
  })

  describe('applicationOrigin', () => {
    it('renders the enter application origin template', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      const requestHandler = applicationsController.applicationOrigin()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/application-origin', {
        errors: {},
        errorSummary: [],
        pageHeading: 'You are applying for:',
      })
    })

    it('renders the form with errors and user input if an error has been sent to the flash', async () => {
      const errorsAndUserInput = createMock<ErrorsAndUserInput>()
      ;(fetchErrorsAndUserInput as jest.Mock).mockReturnValue(errorsAndUserInput)

      const requestHandler = applicationsController.applicationOrigin()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/application-origin', {
        pageHeading: 'You are applying for:',
        errors: errorsAndUserInput.errors,
        errorSummary: errorsAndUserInput.errorSummary,
        ...errorsAndUserInput.userInput,
      })
    })
  })

  describe('selectApplicationOrigin', () => {
    beforeEach(() => {
      response = createMock<Response>({
        locals: { user: { userRoles: ['CAS2_COURT_BAIL_REFERRER', 'CAS2_PRISON_BAIL_REFERRER'] } },
      })
    })

    it('redirects to the select application type page when application origin is not selected', async () => {
      request.body = {
        applicationOrigin: null,
      }

      const requestHandler = applicationsController.selectApplicationOrigin()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.applicationOrigin({}))
    })

    it('redirects to the searchByPrisonNumber page when application origin is prisonBail', async () => {
      request.body = {
        applicationOrigin: 'prisonBail' as ApplicationOrigin,
      }

      const requestHandler = applicationsController.selectApplicationOrigin()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByPrisonNumber({}))
    })

    it('redirects to the searchByCrn page when application origin is courtBail', async () => {
      request.body = {
        applicationOrigin: 'courtBail' as ApplicationOrigin,
      }

      const requestHandler = applicationsController.selectApplicationOrigin()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.searchByCrn({}))
    })

    it('redirects to the unauthorised court bail page when the application origin is courtBail and the user does not have the CAS2_COURT_BAIL_REFERRER role', async () => {
      request.body = {
        applicationOrigin: 'courtBail' as ApplicationOrigin,
      }

      response = createMock<Response>({
        locals: { user: { userRoles: ['CAS2_PRISON_BAIL_REFERRER'] } },
      })

      const requestHandler = applicationsController.selectApplicationOrigin()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.unauthorisedCourtBailApplication({}))
    })

    it('redirects to the unauthorised prison bail page when the application origin is prisonBail and the user does not have the CAS2_PRISON_BAIL_REFERRER role', async () => {
      request.body = {
        applicationOrigin: 'prisonBail' as ApplicationOrigin,
      }

      response = createMock<Response>({
        locals: { user: { userRoles: ['CAS2_COURT_BAIL_REFERRER'] } },
      })

      const requestHandler = applicationsController.selectApplicationOrigin()
      await requestHandler(request, response, next)

      expect(response.redirect).toHaveBeenCalledWith(paths.applications.unauthorisedPrisonBailApplication({}))
    })
  })

  describe('searchByPrisonNumber', () => {
    it('renders the enter prison number template', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      const requestHandler = applicationsController.searchByPrisonNumber()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/search-by-prison-number', {
        errors: {},
        errorSummary: [],
        pageHeading: 'Enter the applicant’s prison number',
      })
    })

    it('renders the form with errors and user input if an error has been sent to the flash', async () => {
      const errorsAndUserInput = createMock<ErrorsAndUserInput>()
      ;(fetchErrorsAndUserInput as jest.Mock).mockReturnValue(errorsAndUserInput)

      const requestHandler = applicationsController.searchByPrisonNumber()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/search-by-prison-number', {
        pageHeading: 'Enter the applicant’s prison number',
        errors: errorsAndUserInput.errors,
        errorSummary: errorsAndUserInput.errorSummary,
        errorStatusCode: errorsAndUserInput.errorStatusCode,
        ...errorsAndUserInput.userInput,
      })
    })
  })

  describe('searchByCrn', () => {
    beforeEach(() => {
      request = createMock<Request>({
        user: { token },
        query: {},
      })
    })
    it('renders the enter CRN template', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      const requestHandler = applicationsController.searchByCrn()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/search-by-crn', {
        applicationOrigin: 'courtBail',
        errors: {},
        errorSummary: [],
        pageHeading: "Enter the person's CRN",
      })
    })

    it('renders the form with errors and user input if an error has been sent to the flash', async () => {
      const errorsAndUserInput = createMock<ErrorsAndUserInput>()
      ;(fetchErrorsAndUserInput as jest.Mock).mockReturnValue(errorsAndUserInput)

      const requestHandler = applicationsController.searchByCrn()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/search-by-crn', {
        applicationOrigin: 'courtBail',
        pageHeading: "Enter the person's CRN",
        errors: errorsAndUserInput.errors,
        errorSummary: errorsAndUserInput.errorSummary,
        ...errorsAndUserInput.userInput,
      })
    })

    describe('applicationOrigin', () => {
      it('sets the applicationOrigin to "prisonBail" when the query param is set', async () => {
        ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
          return { errors: {}, errorSummary: [], userInput: {} }
        })

        request = createMock<Request>({
          user: { token },
          query: { usePrisonBailApplicationOrigin: 'true' },
        })

        const requestHandler = applicationsController.searchByCrn()
        await requestHandler(request, response, next)

        expect(response.render).toHaveBeenCalledWith('applications/search-by-crn', {
          applicationOrigin: 'prisonBail',
          errors: {},
          errorSummary: [],
          pageHeading: "Enter the person's CRN",
        })
      })
    })
  })

  describe('unauthorisedCourtBailApplication', () => {
    it('renders the enter unauthorised court bail application template', async () => {
      ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
        return { errors: {}, errorSummary: [], userInput: {} }
      })

      const requestHandler = applicationsController.unauthorisedCourtBailApplication()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/unauthorised-court-bail-application', {
        errors: {},
        errorSummary: [],
        pageHeading: 'You are unauthorised to make a court bail application',
      })
    })

    it('renders the form with errors and user input if an error has been sent to the flash', async () => {
      const errorsAndUserInput = createMock<ErrorsAndUserInput>()
      ;(fetchErrorsAndUserInput as jest.Mock).mockReturnValue(errorsAndUserInput)

      const requestHandler = applicationsController.unauthorisedCourtBailApplication()
      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('applications/unauthorised-court-bail-application', {
        pageHeading: 'You are unauthorised to make a court bail application',
        errors: errorsAndUserInput.errors,
        errorSummary: errorsAndUserInput.errorSummary,
        ...errorsAndUserInput.userInput,
      })
    })
  })

  describe('submit', () => {
    it('renders the application submission confirmation page', async () => {
      const application = applicationFactory.build()

      ;(buildDocument as jest.Mock).mockReturnValue({})

      request.params.id = 'some-id'

      applicationService.findApplication.mockResolvedValue(application)

      const requestHandler = applicationsController.submit()
      await requestHandler(request, response, next)

      expect(applicationService.findApplication).toHaveBeenCalledWith(request.user.token, request.params.id)
      expect(applicationService.submit).toHaveBeenCalledWith(request.user.token, application)
      expect(response.render).toHaveBeenCalledWith('applications/confirm', {
        pageHeading: 'Application confirmation',
        application,
      })
    })

    describe('when an error occurs', () => {
      it('passes error to error handler', async () => {
        const err = new Error()
        applicationService.submit.mockImplementation(() => {
          throw err
        })

        const application = applicationFactory.build()

        ;(buildDocument as jest.Mock).mockReturnValue({})

        request.params.id = 'some-id'

        applicationService.findApplication.mockResolvedValue(application)

        const requestHandler = applicationsController.submit()
        await requestHandler(request, response, next)

        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.show({ id: application.id }),
        )
      })
    })
  })

  describe('appendToList', () => {
    const page = createMock<TaskListPage>({})

    beforeEach(() => {
      request.body = {
        exampleField: 'example answer',
      }
      request.query = {}
      request.params = {
        id: 'abc123',
        page: 'example-page',
        task: 'example-task',
      }
      request.flash = jest.fn()

      const PageConstructor = jest.fn()
      ;(getPage as jest.Mock).mockReturnValue(PageConstructor)

      applicationService.initializePage.mockResolvedValue(page)
    })

    describe('when there is a redirect path', () => {
      it('redirects to that path', async () => {
        request.query = {
          redirectPage: 'redirect-page',
        }

        applicationService.appendToList.mockResolvedValue()
        ;(generateSuccessMessage as jest.Mock).mockReturnValue('')

        const requestHandler = applicationsController.appendToList()

        await requestHandler({ ...request }, response)

        expect(applicationService.appendToList).toHaveBeenCalledWith(page, request)

        expect(request.flash).toHaveBeenCalledWith('success', '')

        expect(response.redirect).toHaveBeenCalledWith('/applications/abc123/tasks/example-task/pages/redirect-page')
      })
    })

    describe('when the page has a next page', () => {
      it('saves data and calls next function', async () => {
        page.next.mockReturnValue('next-page')

        applicationService.appendToList.mockResolvedValue()

        const requestHandler = applicationsController.appendToList()

        await requestHandler({ ...request }, response)

        expect(applicationService.appendToList).toHaveBeenCalledWith(page, request)

        expect(response.redirect).toHaveBeenCalledWith(
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'next-page' }),
        )
      })
    })

    describe('when the page does not have a next page', () => {
      it('redirects to the task list page', async () => {
        page.next.mockReturnValue('')

        applicationService.appendToList.mockResolvedValue()

        const requestHandler = applicationsController.appendToList()

        await requestHandler({ ...request }, response)

        expect(applicationService.appendToList).toHaveBeenCalledWith(page, request)

        expect(response.redirect).toHaveBeenCalledWith(paths.applications.show({ id: request.params.id }))
      })
    })

    describe('when there are errors', () => {
      it('passes error to error handler', async () => {
        const err = new Error()
        applicationService.appendToList.mockImplementation(() => {
          throw err
        })

        const requestHandler = applicationsController.appendToList()

        await requestHandler({ ...request }, response)

        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'example-page' }),
        )
      })
    })
  })

  describe('removeFromList', () => {
    const page = createMock<TaskListPage>({})

    beforeEach(() => {
      request.query = {
        redirectPage: 'return-page',
      }
      request.params = {
        id: 'abc123',
        task: 'example-task',
        page: 'example-page',
        index: '0',
      }

      const PageConstructor = jest.fn()
      ;(getPage as jest.Mock).mockReturnValue(PageConstructor)

      applicationService.initializePage.mockResolvedValue(page)
    })

    describe('when item is successfully removed', () => {
      it('renders the page', async () => {
        applicationService.removeFromList.mockResolvedValue()

        const requestHandler = applicationsController.removeFromList()

        await requestHandler({ ...request }, response)

        expect(applicationService.removeFromList).toHaveBeenCalledWith(request)

        expect(response.redirect).toHaveBeenCalledWith(
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'return-page' }),
        )
      })
    })

    describe('when an error occurs', () => {
      it('passes error to error handler', async () => {
        const err = new Error()
        applicationService.removeFromList.mockImplementation(() => {
          throw err
        })

        const requestHandler = applicationsController.removeFromList()

        await requestHandler({ ...request }, response)

        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'return-page' }),
        )
      })
    })
  })

  describe('update', () => {
    const page = createMock<TaskListPage>({})

    const taskData = `{
    "example-task": {
      "example-page": {
        "exmaplePageQuestion": "example text"
      }
    }
  }`

    beforeEach(() => {
      request.body = {
        taskData,
        pageName: 'example-page',
        taskName: 'example-task',
      }

      request.params = {
        id: 'abc123',
      }

      const PageConstructor = jest.fn()
      ;(getPage as jest.Mock).mockReturnValue(PageConstructor)

      applicationService.initializePage.mockResolvedValue(page)
    })

    describe('when the page has a next page', () => {
      it('saves data and calls next function', async () => {
        page.next.mockReturnValue('next-page')

        applicationService.saveData.mockResolvedValue()

        const requestHandler = applicationsController.update()

        await requestHandler({ ...request }, response, next)

        expect(applicationService.saveData).toHaveBeenCalledWith(JSON.parse(taskData), request)

        expect(response.redirect).toHaveBeenCalledWith(
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'next-page' }),
        )
      })
    })
    describe('when the page does not have a next page', () => {
      it('redirects to the task list page', async () => {
        page.next.mockReturnValue('')

        applicationService.saveData.mockResolvedValue()

        const requestHandler = applicationsController.update()

        await requestHandler({ ...request }, response, next)

        expect(applicationService.saveData).toHaveBeenCalledWith(JSON.parse(taskData), request)

        expect(response.redirect).toHaveBeenCalledWith(paths.applications.show({ id: request.params.id }))
      })
    })

    describe('when there are errors', () => {
      it('passes error to error handler', async () => {
        const err = new Error()
        applicationService.saveData.mockImplementation(() => {
          throw err
        })

        const requestHandler = applicationsController.update()

        await requestHandler({ ...request }, response, next)

        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.pages.show({ id: request.params.id, task: 'example-task', page: 'example-page' }),
        )
      })
    })
  })

  describe('addNote', () => {
    describe('when a note is added', () => {
      it('redirects to the overview page with a success message', async () => {
        request.params = {
          id: 'abc123',
        }

        request.query = {
          applicationId: 'application-id',
        }

        request.body = { note: 'some notes' }

        const note = applicationNoteFactory.build()

        submittedApplicationService.addApplicationNote.mockImplementation(async () => note)

        const requestHandler = applicationsController.addNote()
        await requestHandler(request, response)

        expect(request.flash).toHaveBeenCalledWith('success', 'Your note was saved.')
        expect(response.redirect).toHaveBeenCalledWith(paths.applications.overview({ id: 'application-id' }))
      })
    })

    describe('when there is an error that is not a 400', () => {
      it('passes the error to the error handler', async () => {
        request.params = {
          id: 'abc123',
        }

        request.query = {
          applicationId: 'application-id',
        }

        request.body = { note: 'some notes' }

        const err = new Error()
        submittedApplicationService.addApplicationNote.mockImplementation(() => {
          throw err
        })

        const requestHandler = applicationsController.addNote()
        await requestHandler(request, response)
        expect(catchValidationErrorOrPropogate).toHaveBeenCalledWith(
          request,
          response,
          err,
          paths.applications.overview({ id: 'application-id' }),
        )
      })
    })

    describe('when there is a 400 error', () => {
      it('adds the error to the flash and redirects back to the page', async () => {
        request.params = {
          id: 'abc123',
        }

        request.query = {
          applicationId: 'application-id',
        }

        request.body = { note: 'some notes' }

        const err = { data: {}, status: 400 }

        submittedApplicationService.addApplicationNote.mockImplementation(() => {
          throw err
        })

        const requestHandler = applicationsController.addNote()
        await requestHandler(request, response)
        expect(request.flash).toHaveBeenCalledWith('errors', {
          note: { text: 'Enter a note for the assessor' },
        })
        expect(response.redirect).toHaveBeenCalledWith(paths.applications.overview({ id: 'application-id' }))
      })
    })
  })

  describe('confirmSubmission', () => {
    it('renders the confirm submission template', async () => {
      request.params = {
        id: 'abc123',
      }

      const requestHandler = applicationsController.confirmSubmission()

      await requestHandler(request, response)

      expect(response.render).toHaveBeenCalledWith('applications/confirm-submission', {
        pageHeading: 'Confirm application submission',
        applicationId: 'abc123',
      })
    })
  })
})
