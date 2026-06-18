import { Request, RequestHandler, Response } from 'express'
import { DataServices, BailApplicationOrigin, NewCohortApplicationOrigin } from '@approved-premises/ui'
import { Cas2v2Application, ApplicationOrigin } from '@approved-premises/api'
import PersonService from '../../services/personService'
import {
  addErrorMessagesToFlash,
  catchValidationErrorOrPropogate,
  errorMessage,
  errorSummary as buildErrorSummary,
  fetchErrorsAndUserInput,
} from '../../utils/validation'
import { ApplicationService, SubmittedApplicationService } from '../../services'
import { generateSuccessMessage, showMissingRequiredTasksOrTaskList } from '../../utils/applications/utils'
import paths from '../../paths/apply'
import { getPage } from '../../utils/applications/getPage'
import { getPaginationDetails } from '../../utils/getPaginationDetails'
import { nameOrPlaceholderCopy } from '../../utils/utils'
import { buildDocument } from '../../utils/applications/documentUtils'
import { hasRole } from '../../utils/userUtils'
import TaskListService from '../../services/taskListService'
import { getApplicationSummaryData } from '../../utils/getApplicationSummaryData'

export default class ApplicationsController {
  constructor(
    private readonly _personService: PersonService,
    private readonly applicationService: ApplicationService,
    private readonly submittedApplicationService: SubmittedApplicationService,
    private readonly dataServices: DataServices,
  ) {}

  index(): RequestHandler {
    return async (req: Request, res: Response) => {
      const applications = await this.applicationService.getAllForLoggedInUser(req.user.token)

      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      const showPrisonDashboard = hasRole(res.locals.user.userRoles, 'CAS2_PRISON_BAIL_REFERRER')

      return res.render('applications/index', {
        errors,
        errorSummary,
        ...userInput,
        applications,
        pageHeading: 'Applications',
        showPrisonDashboard,
      })
    }
  }

  prisonApplications(): RequestHandler {
    return async (req: Request, res: Response) => {
      const crnOrNomsNumber = req.query.crnOrNomsNumber as string
      const paginationParams = crnOrNomsNumber ? { crnOrNomsNumber } : {}
      const { pageNumber, hrefPrefix } = getPaginationDetails(req, paths.applications.prison({}), paginationParams)
      const result = await this.applicationService.getAllByOrigin(
        req.user.token,
        'prisonBail',
        crnOrNomsNumber,
        pageNumber,
      )

      return res.render('applications/prison-applications', {
        applications: result.data,
        pageNumber: Number(result.pageNumber),
        totalPages: Number(result.totalPages),
        hrefPrefix,
        pageHeading: 'All CAS2 prison bail applications',
        crnOrNomsNumber,
      })
    }
  }

  show(): RequestHandler {
    return async (req: Request, res: Response) => {
      const application = await this.applicationService.findApplication(req.user.token, req.params.id)

      if (application.submittedAt) {
        const summary = getApplicationSummaryData('referrerSubmission', application)
        return res.render('applications/show', { application, summary })
      }
      return showMissingRequiredTasksOrTaskList(req, res, application)
    }
  }

  overview(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary } = fetchErrorsAndUserInput(req)

      const application = await this.applicationService.findApplication(req.user.token, req.params.id)

      if (!application.submittedAt) {
        return res.redirect(paths.applications.show({ id: application.id }))
      }

      const status = application.assessment?.statusUpdates?.length
        ? application.assessment?.statusUpdates[0].label
        : 'Received'

      return res.render('applications/overview', {
        application,
        status,
        errors,
        errorSummary,
        pageHeading: 'Overview of application',
      })
    }
  }

  ineligible(): RequestHandler {
    return async (req: Request, res: Response) => {
      const application = await this.applicationService.findApplication(req.user.token, req.params.id)

      return res.render('applications/ineligible', this.ineligibleViewParams(application))
    }
  }

  private ineligibleViewParams(application: Cas2v2Application): Record<string, string | Cas2v2Application> {
    const panelText = `${nameOrPlaceholderCopy(
      application.person,
      'The person',
    )} is not eligible for CAS2 ${application.applicationOrigin === 'other' ? '' : 'for bail'} accommodation`
    const changeAnswerPath = paths.applications.pages.show({
      id: application.id,
      task: 'confirm-eligibility',
      page: 'confirm-eligibility',
    })
    const newApplicationPath = paths.applications.applicationOrigin({})
    return { application, panelText, changeAnswerPath, newApplicationPath }
  }

  create(): RequestHandler {
    return async (req: Request, res: Response) => {
      const {
        crn,
        prisonNumber,
        applicationOrigin,
      }: { crn: string; prisonNumber: string; applicationOrigin: BailApplicationOrigin } = req.body
      try {
        const application = await this.applicationService.createApplication(req.user.token, crn, applicationOrigin)

        return res.redirect(paths.applications.show({ id: application.id }))
      } catch (err) {
        if (applicationOrigin === 'prisonBail') {
          if (err.status === 404) {
            addErrorMessagesToFlash(
              req,
              'prisonNumber',
              `No person found for prison number ${prisonNumber}, please try another number.`,
            )
          } else if (err.status === 403) {
            addErrorMessagesToFlash(
              req,
              'prisonNumber',
              `You do not have permission to access the prison number ${prisonNumber}, please try another number.`,
            )
          } else {
            addErrorMessagesToFlash(
              req,
              'prisonNumber',
              'There was an error creating the application, please try again.',
            )
          }

          return res.redirect(paths.applications.searchByPrisonNumber({}))
        }

        if (applicationOrigin === 'courtBail') {
          if (err.status === 404) {
            addErrorMessagesToFlash(req, 'crn', `No person found for CRN ${crn}, please try another number.`)
          } else if (err.status === 403) {
            addErrorMessagesToFlash(
              req,
              'crn',
              `You do not have permission to access the CRN ${crn}, please try another number.`,
            )
          } else {
            addErrorMessagesToFlash(req, 'crn', 'There was an error creating the application, please try again.')
          }

          return res.redirect(paths.applications.searchByCrn({}))
        }

        addErrorMessagesToFlash(
          req,
          'applicationOrigin',
          'There was an error creating the application, please try again.',
        )
        return res.redirect(paths.applications.applicationOrigin({}))
      }
    }
  }

  beforeYouStart(): RequestHandler {
    return async (req: Request, res: Response) => {
      return res.render('applications/before-you-start', {
        heading: 'Apply for short-term accommodation (CAS2)',
        backUrl: paths.applications.newCohorts.applicationOrigin({}),
        nextUrl: paths.applications.newCohorts.searchByCrn({}),
      })
    }
  }

  beforeYouStartBail(options: { newCohorts: boolean }): RequestHandler {
    return async (req: Request, res: Response) => {
      if (options.newCohorts) {
        return res.render('applications/before-you-start-bail', {
          heading: 'Apply for short-term accommodation (CAS2) for bail',
          backUrl: paths.applications.newCohorts.applicationOrigin({}),
          nextUrl: paths.applications.newCohorts.bail.applicationOrigin({}),
        })
      }

      return res.render('applications/before-you-start-bail', {
        heading: 'Apply for CAS2 for bail',
        nextUrl: paths.applications.applicationOrigin({}),
      })
    }
  }

  applicationOrigin(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      return res.render('applications/application-origin', {
        errors,
        errorSummary,
        ...userInput,
        pageHeading: 'Which type of application do you want to make?',
      })
    }
  }

  bailApplicationOrigin(options: { newCohorts: boolean }): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      const backUrl = options.newCohorts
        ? paths.applications.newCohorts.bail.beforeYouStart({})
        : paths.applications.beforeYouStart({})
      const nextUrl = options.newCohorts
        ? paths.applications.newCohorts.bail.selectApplicationOrigin({})
        : paths.applications.selectApplicationOrigin({})

      return res.render('applications/bail-application-origin', {
        backUrl,
        nextUrl,
        errors,
        errorSummary,
        ...userInput,
      })
    }
  }

  selectApplicationOrigin(): RequestHandler {
    return async (req: Request, res: Response) => {
      if ((req.body.applicationOrigin as NewCohortApplicationOrigin) === 'bail') {
        return res.redirect(paths.applications.newCohorts.bail.beforeYouStart({}))
      }

      if ((req.body.applicationOrigin as NewCohortApplicationOrigin) === 'other') {
        return res.redirect(paths.applications.newCohorts.beforeYouStart({}))
      }

      const message = 'Select the type of application you want to make'

      req.flash('errors', {
        applicationOrigin: errorMessage('applicationOrigin', message),
      })

      req.flash('errorSummary', [buildErrorSummary('applicationOrigin', message)])

      return res.redirect(paths.applications.newCohorts.applicationOrigin({}))
    }
  }

  selectBailApplicationOrigin(options: { newCohorts: boolean }): RequestHandler {
    return async (req: Request, res: Response) => {
      if ((req.body.applicationOrigin as BailApplicationOrigin) === 'prisonBail') {
        const hasPrisonBailReferrerRole = hasRole(res.locals.user.userRoles, 'CAS2_PRISON_BAIL_REFERRER')

        if (hasPrisonBailReferrerRole) {
          return options.newCohorts
            ? res.redirect(paths.applications.newCohorts.bail.searchByPrisonNumber({}))
            : res.redirect(paths.applications.searchByPrisonNumber({}))
        }
        return options.newCohorts
          ? res.redirect(paths.applications.newCohorts.bail.unauthorisedPrisonBailApplication({}))
          : res.redirect(paths.applications.unauthorisedPrisonBailApplication({}))
      }

      if ((req.body.applicationOrigin as BailApplicationOrigin) === 'courtBail') {
        const hasCourtBailReferrerRole = hasRole(res.locals.user.userRoles, 'CAS2_COURT_BAIL_REFERRER')

        if (hasCourtBailReferrerRole) {
          return options.newCohorts
            ? res.redirect(paths.applications.newCohorts.bail.searchByCrn({}))
            : res.redirect(paths.applications.searchByCrn({}))
        }
        return options.newCohorts
          ? res.redirect(paths.applications.newCohorts.bail.unauthorisedCourtBailApplication({}))
          : res.redirect(paths.applications.unauthorisedCourtBailApplication({}))
      }

      const message = 'Please select an application type'

      req.flash('errors', {
        applicationOrigin: errorMessage('applicationOrigin', message),
      })

      req.flash('errorSummary', [buildErrorSummary('applicationOrigin', message)])

      return options.newCohorts
        ? res.redirect(paths.applications.newCohorts.bail.applicationOrigin({}))
        : res.redirect(paths.applications.applicationOrigin({}))
    }
  }

  searchByPrisonNumber(options?: { newCohorts: boolean }): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput, errorStatusCode } = fetchErrorsAndUserInput(req)

      const backUrl = options?.newCohorts
        ? paths.applications.newCohorts.bail.applicationOrigin({})
        : paths.applications.applicationOrigin({})

      const nextUrl = options?.newCohorts
        ? paths.applications.newCohorts.bail.people.findByPrisonNumber({})
        : paths.applications.people.findByPrisonNumber({})

      return res.render('applications/search-by-prison-number', {
        errors,
        errorSummary,
        errorStatusCode,
        ...userInput,
        pageHeading: 'Enter the applicant’s prison number',
        backUrl,
        nextUrl,
      })
    }
  }

  searchByCrn(newCohortOrigin?: NewCohortApplicationOrigin): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      let applicationOrigin: ApplicationOrigin

      if (newCohortOrigin === 'other') {
        applicationOrigin = 'other'
      } else {
        applicationOrigin = req.query.usePrisonBailApplicationOrigin ? 'prisonBail' : 'courtBail'
      }

      let backUrl: string
      let nextUrl: string

      if (newCohortOrigin === 'bail') {
        backUrl = paths.applications.newCohorts.bail.applicationOrigin({})
        nextUrl = paths.applications.newCohorts.bail.people.findByCrn({})
      } else if (newCohortOrigin === 'other') {
        backUrl = paths.applications.newCohorts.beforeYouStart({})
        nextUrl = paths.applications.newCohorts.people.findByCrn({})
      } else {
        backUrl = paths.applications.applicationOrigin({})
        nextUrl = paths.applications.people.findByCrn({})
      }

      return res.render('applications/search-by-crn', {
        applicationOrigin,
        errors,
        errorSummary,
        ...userInput,
        pageHeading: "Enter the person's CRN",
        backUrl,
        nextUrl,
      })
    }
  }

  unauthorisedCourtBailApplication(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      return res.render('applications/unauthorised-court-bail-application', {
        errors,
        errorSummary,
        ...userInput,
        pageHeading: 'You are unauthorised to make a court bail application',
      })
    }
  }

  unauthorisedPrisonBailApplication(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      return res.render('applications/unauthorised-prison-bail-application', {
        errors,
        errorSummary,
        ...userInput,
        pageHeading: 'You are unauthorised to make a prison bail application',
      })
    }
  }

  submit(): RequestHandler {
    return async (req: Request, res: Response) => {
      const application = await this.applicationService.findApplication(req.user.token, req.params.id)
      application.document = buildDocument(application)
      const taskList = new TaskListService(application)

      if (taskList.status !== 'complete') {
        this.handleIncompleteTasks(req, res, application, taskList)
        return
      }
      try {
        await this.applicationService.submit(req.user.token, application)
        res.render('applications/confirm', { pageHeading: 'Application confirmation', application })
      } catch (err) {
        catchValidationErrorOrPropogate(req, res, err, paths.applications.show({ id: application.id }))
      }
    }
  }

  update(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { taskData, pageName, taskName } = req.body
      const Page = getPage(taskName, pageName, 'applications')
      const page = await this.applicationService.initializePage(Page, req, this.dataServices)
      const data = JSON.parse(taskData)

      try {
        await this.applicationService.saveData(data, req)
        const next = page.next()
        if (next) {
          res.redirect(paths.applications.pages.show({ id: req.params.id, task: taskName, page: page.next() }))
        } else {
          res.redirect(paths.applications.show({ id: req.params.id }))
        }
      } catch (err) {
        catchValidationErrorOrPropogate(
          req,
          res,
          err,
          paths.applications.pages.show({ id: req.params.id, task: taskName, page: pageName }),
        )
      }
    }
  }

  appendToList() {
    return async (req: Request, res: Response) => {
      const { id, page: pageName, task: taskName } = req.params
      const { redirectPage } = req.query
      const Page = getPage(taskName, pageName, 'applications')
      const page = await this.applicationService.initializePage(Page, req, this.dataServices)

      try {
        await this.applicationService.appendToList(page, req)

        req.flash('success', generateSuccessMessage(pageName))
        const next = page.next()

        if (redirectPage) {
          res.redirect(paths.applications.pages.show({ id, task: taskName, page: redirectPage as string }))
        } else if (next) {
          res.redirect(paths.applications.pages.show({ id, task: taskName, page: page.next() }))
        } else {
          res.redirect(paths.applications.show({ id }))
        }
      } catch (err) {
        catchValidationErrorOrPropogate(
          req,
          res,
          err,
          paths.applications.pages.show({ id, task: taskName, page: pageName }),
        )
      }
    }
  }

  removeFromList() {
    return async (req: Request, res: Response) => {
      const { id, task } = req.params
      const { redirectPage } = req.query

      try {
        await this.applicationService.removeFromList(req)
      } catch (err) {
        catchValidationErrorOrPropogate(
          req,
          res,
          err,
          paths.applications.pages.show({ id, task, page: redirectPage as string }),
        )
      }
      return res.redirect(paths.applications.pages.show({ id, task, page: redirectPage as string }))
    }
  }

  addNote() {
    return async (req: Request, res: Response) => {
      const { id } = req.params
      const { applicationId } = req.query as { applicationId: string }
      const { note } = req.body

      try {
        await this.submittedApplicationService.addApplicationNote(req.user.token, id, note)
        req.flash('success', 'Your note was saved.')
        res.redirect(paths.applications.overview({ id: applicationId }))
      } catch (err) {
        if (err.status === 400) {
          req.flash('errors', {
            note: { text: 'Enter a note for the assessor' },
          })
          req.flash('errorSummary', [{ text: 'Enter a note for the assessor', href: '#note' }])
          res.redirect(paths.applications.overview({ id: applicationId }))
        } else {
          catchValidationErrorOrPropogate(req, res, err, paths.applications.overview({ id: applicationId }))
        }
      }
    }
  }

  confirmSubmission() {
    return async (req: Request, res: Response) => {
      const { id } = req.params

      res.render('applications/confirm-submission', {
        pageHeading: 'Confirm application submission',
        applicationId: id,
      })
    }
  }

  public handleIncompleteTasks(req: Request, res: Response, application: Cas2v2Application, taskList: TaskListService) {
    req.flash('errors', {
      taskList: errorMessage('taskList', 'You must complete all tasks before submitting the application'),
    })
    req.flash('errorSummary', [
      {
        text: 'You must complete all tasks before submitting the application',
        href: `#${taskList.firstIncompleteTask ?? ''}-status`,
      },
    ])
    res.redirect(paths.applications.show({ id: application.id }))
  }
}
