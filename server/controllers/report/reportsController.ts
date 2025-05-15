import { Request, RequestHandler, Response, TypedRequestHandler } from 'express'
import paths from '../../paths/report'
import ReportService from '../../services/reportService'
import { hasRole } from '../../utils/userUtils'

export default class ReportsController {
  constructor(private readonly reportsService: ReportService) {}

  new(): RequestHandler {
    return async (_req: Request, res: Response) => {
      if (!hasRole(res.locals.user.userRoles, 'CAS2_MI')) {
        return res.redirect(paths.report.unauthorised({}))
      }
      return res.render('reports/new', {})
    }
  }

  create(): TypedRequestHandler<Request, Response> {
    return async (req: Request, res: Response) => {
      try {
        return await this.reportsService.getReport(req.params.name, req.user.token, res)
      } catch {
        return res.redirect(paths.report.new({}))
      }
    }
  }

  unauthorised(): RequestHandler {
    return async (_req: Request, res: Response) => {
      return res.render('reports/unauthorised', { pageHeading: 'You are not authorised to view this page.' })
    }
  }
}
