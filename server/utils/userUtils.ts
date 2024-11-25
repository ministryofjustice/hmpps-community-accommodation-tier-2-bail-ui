import { ServiceSection } from 'server/@types/ui'

import applyPaths from '../paths/apply'
import assessPaths from '../paths/assess'
import reportsPaths from '../paths/report'

export const sections = {
  applications: {
    id: 'applications',
    title: 'View your applications',
    description: 'View all of your in progress and submitted CAS-2 applications.',
    shortTitle: 'Applications',
    href: applyPaths.applications.index({}),
  },
  newApplication: {
    id: 'new-application',
    title: 'Start a new application',
    description: 'Start a new CAS-2 application for a HDC applicant.',
    shortTitle: 'New application',
    href: applyPaths.applications.beforeYouStart({}),
  },
  submittedApplications: {
    id: 'submitted-applications',
    title: 'Submitted applications',
    description: 'View all CAS-2 submitted applications',
    shortTitle: 'Submitted applications',
    href: assessPaths.submittedApplications.index.pattern,
  },
  managementInformationReports: {
    id: 'management-information-reports',
    title: 'Management information reports',
    description: 'View all CAS-2 management information reports to download',
    shortTitle: 'Management information reports',
    href: reportsPaths.report.new.pattern,
  },
  prisonDashboard: {
    id: 'prison-dashboard',
    title: 'View your prison’s applications',
    description: 'View recently submitted CAS-2 applications from your prison.',
    shortTitle: 'View your prison’s applications',
    href: applyPaths.applications.prison.pattern,
  },
}

export const hasRole = (userRoles: Array<string>, role: string): boolean => {
  return userRoles.includes(role)
}

export const sectionsForUser = (): Array<ServiceSection> => {
  const items = []

  items.push(sections.applications)
  items.push(sections.newApplication)
  items.push(sections.prisonDashboard)

  return Array.from(new Set(items))
}
