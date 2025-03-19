import type { Request, RequestHandler, Response } from 'express'

import { addErrorMessagesToFlash } from '../utils/validation'
import PersonService from '../services/personService'
import ApplicationService from '../services/applicationService'
import { DateFormats } from '../utils/dateUtils'
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
            addErrorMessagesToFlash(req, 'prisonNumber', 'Something went wrong. Please try again later.')
          }

          return res.redirect(paths.applications.searchByPrisonNumber({}))
        }
      } else {
        addErrorMessagesToFlash(req, 'prisonNumber', 'Enter a prison number')
        return res.redirect(paths.applications.searchByPrisonNumber({}))
      }
    }
  }

  findByCrn(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { crn, applicationOrigin } = req.body

      if (crn) {
        try {
          const person = await this.personService.findByCrn(req.user.token, crn)

          return res.render(`people/confirm-applicant-details`, {
            pageHeading: `Confirm ${person.name}'s details`,
            person,
            date: DateFormats.dateObjtoUIDate(new Date()),
            dateOfBirth: DateFormats.isoDateToUIDate(person.dateOfBirth, { format: 'short' }),
            applicationOrigin,
          })
        } catch (err) {
          if (err.status === 404) {
            addErrorMessagesToFlash(req, 'crn', `No person found for CRN ${crn}, please try another number.`)
          } else if (err.status === 403) {
            addErrorMessagesToFlash(
              req,
              'crn',
              `You do not have permission to access the CRN ${crn}, please try another number.`,
            )
          } else {
            addErrorMessagesToFlash(req, 'crn', 'Something went wrong. Please try again later.')
          }

          return res.redirect(paths.applications.searchByCrn({}))
        }
      } else {
        addErrorMessagesToFlash(req, 'crn', 'Enter a CRN')
        return res.redirect(paths.applications.searchByCrn({}))
      }
    }
  }
}
