import type { Request, RequestHandler, Response } from 'express'

import { errorMessage, errorSummary } from '../utils/validation'
import PersonService from '../services/personService'
import ApplicationService from '../services/applicationService'
import { DateFormats } from '../utils/dateUtils'
import { validateReferer } from '../utils/viewUtils'
import paths from '../paths/apply'

export default class PeopleController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly personService: PersonService,
  ) {}

  findByPrisonNumber(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { prisonNumber, applicationOrigin } = req.body

      if (prisonNumber) {
        try {
          const person = await this.personService.findByPrisonNumber(req.user.token, prisonNumber)

          return res.render(`people/confirm-applicant-details`, {
            pageHeading: `Confirm ${person.name}'s details`,
            person,
            date: DateFormats.dateObjtoUIDate(new Date()),
            dateOfBirth: DateFormats.isoDateToUIDate(person.dateOfBirth, { format: 'short' }),
            applicationOrigin,
          })
        } catch (err) {
          if (err.status === 404) {
            this.addErrorMessagesToFlash(
              req,
              'prisonNumber',
              `No person found for prison number ${prisonNumber}, please try another number.`,
            )
          } else if (err.status === 403) {
            this.addErrorMessagesToFlash(
              req,
              'prisonNumber',
              `You do not have permission to access the prison number ${prisonNumber}, please try another number.`,
            )
          } else {
            this.addErrorMessagesToFlash(req, 'prisonNumber', 'Something went wrong. Please try again later.')
          }

          return res.redirect(paths.applications.searchByPrisonNumber({}))
        }
      } else {
        this.addErrorMessagesToFlash(req, 'prisonNumber', 'Enter a prison number')
        return res.redirect(paths.applications.searchByPrisonNumber({}))
      }
    }
  }
          }

          return res.redirect(validateReferer(req.headers.referer))
        }
      } else {
        this.addErrorMessagesToFlash(req, 'Enter a prison number')
        return res.redirect(validateReferer(req.headers.referer))
      }
    }
  }

  addErrorMessagesToFlash(request: Request, key: string, message: string) {
    request.flash('errors', {
      [key]: errorMessage(key, message),
    })
    request.flash('errorSummary', [errorSummary(key, message)])
    request.flash('userInput', request.body)
  }
}
