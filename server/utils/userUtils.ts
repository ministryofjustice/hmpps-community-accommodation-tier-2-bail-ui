import { ServiceSection } from 'server/@types/ui'

import applyPaths from '../paths/apply'
import assessPaths from '../paths/assess'
import reportsPaths from '../paths/report'

export const sections = {
  applications: {
    id: 'applications',
    title: 'View and action your applications',
    description:
      '<p>You can:<br/><ul><li>continue editing or discard any applications you have started</li><li>view the status of any applications you have submitted</li><li>check if there are any requests for information that you need to action</li></ul></p>',
    shortTitle: 'Applications',
    href: applyPaths.applications.index({}),
  },
  newApplication: {
    id: 'new-application',
    title: 'Start a new application',
    description: '<p>You can save your progress and return to the application at any time.</p>',
    shortTitle: 'New application',
    href: applyPaths.applications.beforeYouStart({}),
  },
  submittedApplications: {
    id: 'submitted-applications',
    title: 'Submitted applications',
    description: '<p>View all CAS-2 bail submitted applications</p>',
    shortTitle: 'Submitted applications',
    href: assessPaths.submittedApplications.index.pattern,
  },
  managementInformationReports: {
    id: 'management-information-reports',
    title: 'Management information reports',
    description: '<p>View all CAS-2 bail management information reports to download</p>',
    shortTitle: 'Management information reports',
    href: reportsPaths.report.new.pattern,
  },
}

export const hasRole = (userRoles: Array<string>, role: string): boolean => {
  return userRoles.includes(role)
}

export const sectionsForUser = (userRoles: Array<string>): Array<ServiceSection> => {
  const items = []

  if (hasRole(userRoles, 'CAS2_PRISON_BAIL_REFERRER') || hasRole(userRoles, 'CAS2_COURT_BAIL_REFERRER')) {
    items.push(sections.applications)
    items.push(sections.newApplication)
  }
  if (hasRole(userRoles, 'CAS2_ADMIN')) {
    items.push(sections.submittedApplications)
  }
  if (hasRole(userRoles, 'CAS2_MI')) {
    items.push(sections.managementInformationReports)
  }

  return Array.from(new Set(items))
}
