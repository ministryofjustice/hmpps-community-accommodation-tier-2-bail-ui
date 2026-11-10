import type { Request, RequestHandler, Response } from 'express'

import { NewCohortApplicationOrigin } from '@approved-premises/ui'
import { addErrorMessagesToFlash } from '../utils/validation'
import PersonService from '../services/personService'
import ApplicationService from '../services/applicationService'
import { DateFormats } from '../utils/dateUtils'
import paths from '../paths/apply'
import { isValidCrnOrNomsNumber } from '../utils/utils'
import config from '../config'

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
        const trimmedPrisonNumber = (prisonNumber as string).trim()

        try {
          const person = await this.personService.findByPrisonNumber(req.user.token, trimmedPrisonNumber)

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
              `No person found for prison number ${trimmedPrisonNumber}. You can try again, or search using a different prison number or a case reference number (CRN)`,
              '404',
            )
          } else if (err.status === 403) {
            addErrorMessagesToFlash(
              req,
              'prisonNumber',
              `You do not have permission to access the prison number ${trimmedPrisonNumber}, please try another number.`,
            )
          } else if (!isValidCrnOrNomsNumber(trimmedPrisonNumber)) {
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
        const trimmedCrn = (crn as string).trim()

        try {
          const person = await this.personService.findByCrn(req.user.token, trimmedCrn)

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
            addErrorMessagesToFlash(req, 'crn', `No person found for CRN ${trimmedCrn}, please try another number.`)
          } else if (err.status === 403) {
            addErrorMessagesToFlash(
              req,
              'crn',
              `You do not have permission to access the CRN ${trimmedCrn}, please try another number.`,
            )
          } else if (!isValidCrnOrNomsNumber(trimmedCrn)) {
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

  findByCrnFromFama(): RequestHandler {
    return async (req: Request, res: Response) => {
      const crn = req.query.crn as string
      const trimmedCrn = crn.trim()

      const backUrl = new URL(
        `cases/${encodeURIComponent(trimmedCrn)}`,
        config.findAndManageAccommodationUrl,
      ).toString()

      try {
        const person = await this.personService.findByCrn(req.user.token, trimmedCrn)

        return res.render('people/confirm-applicant-details', {
          pageHeading: `Confirm ${person.name}'s details for CAS2 application`,
          person,
          date: DateFormats.dateObjtoUIDate(new Date()),
          dateOfBirth: DateFormats.isoDateToUIDate(person.dateOfBirth, { format: 'short' }),
          applicationOrigin: 'other',
          backUrl,
          hideSearchLink: true,
        })
      } catch (err) {
        res.status(500)
        return res.render('pages/error', {
          message: 'Something went wrong. The error has been logged. Please try again',
          backUrl,
        })
      }
    }
  }
}
