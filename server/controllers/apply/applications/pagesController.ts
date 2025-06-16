import type { NextFunction, Request, RequestHandler, Response } from 'express'
import createError from 'http-errors'

import type { DataServices } from '@approved-premises/ui'
import { ApplicationService } from '../../../services'

import {
  catchAPIErrorOrPropogate,
  fetchErrorsAndUserInput,
  catchValidationErrorOrPropogate,
} from '../../../utils/validation'
import { UnknownPageError } from '../../../utils/errors'

import paths from '../../../paths/apply'
import { viewPath } from '../../../form-pages/utils'
import { getPage } from '../../../utils/applications/getPage'

export default class PagesController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly dataServices: DataServices,
  ) {}

  show(taskName: string, pageName: string): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const Page = getPage(taskName, pageName, 'applications')
        const { errors, errorSummary, userInput } = fetchErrorsAndUserInput(req)
        const page = await this.applicationService.initializePage(Page, req, this.dataServices, userInput)

        res.render(viewPath(page, 'applications'), {
          applicationId: req.params.id,
          errors,
          errorSummary,
          task: taskName,
          page,
          ...page.body,
        })
      } catch (e) {
        if (e instanceof UnknownPageError) {
          next(createError(404, 'Not found'))
        } else {
          catchAPIErrorOrPropogate(req, res, e)
        }
      }
    }
  }

  update(taskName: string, pageName: string) {
    return async (req: Request, res: Response) => {
      const Page = getPage(taskName, pageName, 'applications')
      const page = await this.applicationService.initializePage(Page, req, this.dataServices)

      try {
        let next = ''
        // For the confirm consent page, we need to call page.next() before save because if the answer is 'no', it will be removed on save and we will be unable to calculate the next page
        if (pageName === 'confirm-consent') {
          next = page.next()
          // If there are errors on this page, they will still be handled by the save call
          await this.applicationService.save(page, req)
          // For other pages we need to call save and check for errors before we calculate the next page
        } else {
          await this.applicationService.save(page, req)
          next = page.next()
        }
        if (next) {
          res.redirect(paths.applications.pages.show({ id: req.params.id, task: taskName, page: next }))
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
}
