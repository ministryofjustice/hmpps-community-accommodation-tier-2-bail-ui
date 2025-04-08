import type { Request, RequestHandler, Response } from 'express'
import { sectionsForUser } from '../utils/userUtils'

export default class DashboardController {
  index(): RequestHandler {
    return (_req: Request, res: Response) => {
      const sections = sectionsForUser(res.locals.user.userRoles)

      res.render('dashboard/index', {
        pageHeading: 'Short-term accommodation (CAS2) for bail',
        sections,
      })
    }
  }
}
