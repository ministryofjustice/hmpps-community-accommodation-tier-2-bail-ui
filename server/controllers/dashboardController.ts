import type { Request, RequestHandler, Response } from 'express'
import { sectionsForUser } from '../utils/userUtils'

export default class DashboardController {
  index(): RequestHandler {
    return (_req: Request, res: Response) => {
      const sections = sectionsForUser()

      res.render('dashboard/index', {
        pageHeading: 'CAS-2: Short-Term Accommodation',
        sections,
      })
    }
  }
}
