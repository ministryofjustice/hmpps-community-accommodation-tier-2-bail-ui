import { Request, RequestHandler, Response } from 'express'
import { DataServices, ApplicationOrigin } from '@approved-premises/ui'
import { Cas2v2Application } from '@approved-premises/api'
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

      return res.render('applications/index', {
        errors,
        errorSummary,
        ...userInput,
        applications,
        pageHeading: 'Applications',
      })
    }
  }

  prisonApplications(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { pageNumber, hrefPrefix } = getPaginationDetails(req, paths.applications.prison({}))
      const result = await this.applicationService.getAllByOrigin(req.user.token, 'prisonBail', pageNumber)

      return res.render('applications/prison-applications', {
        applications: result.data,
        pageNumber: Number(result.pageNumber),
        totalPages: Number(result.totalPages),
        hrefPrefix,
        pageHeading: 'All CAS-2 prison bail applications',
      })
    }
  }

  show(): RequestHandler {
    return async (req: Request, res: Response) => {
      const application = await this.applicationService.findApplication(req.user.token, req.params.id)

      if (application.submittedAt) {
        return res.render('applications/show', { application })
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
    )} is not eligible for CAS-2 accommodation`
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
      }: { crn: string; prisonNumber: string; applicationOrigin: ApplicationOrigin } = req.body
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

  applicationOrigin(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      return res.render('applications/application-origin', {
        errors,
        errorSummary,
        ...userInput,
        pageHeading: 'Where are you making the application from?',
      })
    }
  }

  selectApplicationOrigin(): RequestHandler {
    return async (req: Request, res: Response) => {
      if ((req.body.applicationOrigin as ApplicationOrigin) === 'prisonBail') {
        if (!hasRole(res.locals.user.userRoles, 'CAS2_PRISON_BAIL_REFERRER')) {
          return res.redirect(paths.applications.unauthorisedPrisonBailApplication({}))
        }

        return res.redirect(paths.applications.searchByPrisonNumber({}))
      }

      if ((req.body.applicationOrigin as ApplicationOrigin) === 'courtBail') {
        if (!hasRole(res.locals.user.userRoles, 'CAS2_COURT_BAIL_REFERRER')) {
          return res.redirect(paths.applications.unauthorisedCourtBailApplication({}))
        }

        return res.redirect(paths.applications.searchByCrn({}))
      }

      const message = 'Please select an application type'

      req.flash('errors', {
        applicationOrigin: errorMessage('applicationOrigin', message),
      })

      req.flash('errorSummary', [buildErrorSummary('applicationOrigin', message)])

      return res.redirect(paths.applications.applicationOrigin({}))
    }
  }

  searchByPrisonNumber(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput, errorStatusCode } = fetchErrorsAndUserInput(req)

      return res.render('applications/search-by-prison-number', {
        errors,
        errorSummary,
        errorStatusCode,
        ...userInput,
        pageHeading: 'Enter the applicant’s prison number',
      })
    }
  }

  searchByCrn(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)

      const applicationOrigin: ApplicationOrigin = req.query.usePrisonBailApplicationOrigin ? 'prisonBail' : 'courtBail'

      return res.render('applications/search-by-crn', {
        applicationOrigin,
        errors,
        errorSummary,
        ...userInput,
        pageHeading: "Enter the person's CRN",
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
}
