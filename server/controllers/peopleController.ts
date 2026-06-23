import type { Request, RequestHandler, Response } from 'express'

import { NewCohortApplicationOrigin } from '@approved-premises/ui'
import { addErrorMessagesToFlash } from '../utils/validation'
import PersonService from '../services/personService'
import ApplicationService from '../services/applicationService'
import { DateFormats } from '../utils/dateUtils'
import paths from '../paths/apply'
import { isValidCrnOrNomsNumber } from '../utils/utils'

export default class PeopleController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly personService: PersonService,
  ) {}

  findByPrisonNumber(newCohortOrigin?: NewCohortApplicationOrigin): RequestHandler {
    return async (req: Request, res: Response) => {
      const { prisonNumber, applicationOrigin } = req.body

      const backUrl =
        newCohortOrigin === 'bail'
          ? paths.applications.newCohorts.bail.searchByPrisonNumber({})
          : paths.applications.searchByPrisonNumber({})

      if (prisonNumber) {
        try {
          const person = await this.personService.findByPrisonNumber(req.user.token, prisonNumber)

          return res.render(`people/confirm-applicant-details`, {
            pageHeading: `Confirm ${person.name}'s details`,
            person,
            date: DateFormats.dateObjtoUIDate(new Date()),
            dateOfBirth: DateFormats.isoDateToUIDate(person.dateOfBirth, { format: 'short' }),
            applicationOrigin,
            backUrl,
          })
        } catch (err) {
          if (err.status === 404) {
            addErrorMessagesToFlash(
              req,
              'prisonNumber',
              `No person found for prison number ${prisonNumber}. You can try again, or search using a different prison number or a case reference number (CRN)`,
              '404',
            )
          } else if (err.status === 403) {
            addErrorMessagesToFlash(
              req,
              'prisonNumber',
              `You do not have permission to access the prison number ${prisonNumber}, please try another number.`,
            )
          } else if (!isValidCrnOrNomsNumber(prisonNumber)) {
            addErrorMessagesToFlash(req, 'prisonNumber', 'Enter a prison number in the correct format')
          } else {
            addErrorMessagesToFlash(req, 'prisonNumber', 'Something went wrong. Please try again later.')
          }

          return res.redirect(backUrl)
        }
      } else {
        addErrorMessagesToFlash(req, 'prisonNumber', 'Enter a prison number')
        return res.redirect(backUrl)
      }
    }
  }

  findByCrn(newCohortOrigin?: NewCohortApplicationOrigin): RequestHandler {
    return async (req: Request, res: Response) => {
      const { crn, applicationOrigin } = req.body

      let backUrl: string

      if (newCohortOrigin === 'bail') {
        backUrl = paths.applications.newCohorts.bail.searchByCrn({})
      } else if (newCohortOrigin === 'other') {
        backUrl = paths.applications.newCohorts.searchByCrn({})
      } else {
        backUrl = paths.applications.searchByCrn({})
      }

      if (crn) {
        try {
          const person = await this.personService.findByCrn(req.user.token, crn)

          return res.render(`people/confirm-applicant-details`, {
            pageHeading: `Confirm ${person.name}'s details`,
            person,
            date: DateFormats.dateObjtoUIDate(new Date()),
            dateOfBirth: DateFormats.isoDateToUIDate(person.dateOfBirth, { format: 'short' }),
            applicationOrigin,
            backUrl,
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
          } else if (!isValidCrnOrNomsNumber(crn)) {
            addErrorMessagesToFlash(req, 'crn', 'Enter a CRN in the correct format')
          } else {
            addErrorMessagesToFlash(req, 'crn', 'Something went wrong. Please try again later.')
          }

          return res.redirect(backUrl)
        }
      } else {
        addErrorMessagesToFlash(req, 'crn', 'Enter a CRN')
        return res.redirect(backUrl)
      }
    }
  }
}
