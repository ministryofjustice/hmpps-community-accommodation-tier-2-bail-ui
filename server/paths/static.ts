import { path } from 'static-path'

const cookiesPolicyPath = path('/cookies')
const maintenancePath = path('/maintenance')
const privacyNoticePath = path('/privacy-notice')
const accessibilityStatementPath = path('/accessibility-statement')
const interviewQuestionsHtmlPath = path('/interview-questions.html')
const interviewQuestionsDocxPath = path('/interview-questions.docx')

const paths = {
  static: {
    cookiesPolicy: cookiesPolicyPath,
    maintenancePage: maintenancePath,
    privacyNotice: privacyNoticePath,
    accessibilityStatement: accessibilityStatementPath,
    interviewQuestionsHtml: interviewQuestionsHtmlPath,
    interviewQuestionsDocx: interviewQuestionsDocxPath,
  },
}

export default paths
