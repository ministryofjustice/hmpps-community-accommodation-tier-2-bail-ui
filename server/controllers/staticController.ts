import type { Request, RequestHandler, Response } from 'express'
import path from 'path'

export default class StaticController {
  maintenancePage(): RequestHandler {
    return (_req: Request, res: Response) => {
      res.render('static/maintenance')
    }
  }

  privacyNoticePage(): RequestHandler {
    return (_req: Request, res: Response) => {
      res.render('static/privacy-notice')
    }
  }

  cookiesPolicyPage(): RequestHandler {
    return (_req: Request, res: Response) => {
      res.render('static/cookies-policy')
    }
  }

  accessibilityStatementPage(): RequestHandler {
    return (_req: Request, res: Response) => {
      res.render('static/accessibility-statement')
    }
  }

  interviewQuestionsHtml(): RequestHandler {
    return (_req: Request, res: Response) => {
      res.render('static/interview-questions-sheet.html')
    }
  }

  interviewQuestionsDocx(): RequestHandler {
    return (_req: Request, res: Response) => {
      const basePath = path.resolve(__dirname, '..')
      const filePath = path.join(basePath, 'views', 'static', 'interview-questions-sheet.docx')

      res.sendFile(filePath)
    }
  }
}
