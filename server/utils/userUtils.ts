import { ServiceSection } from 'server/@types/ui'

import applyPaths from '../paths/apply'
import assessPaths from '../paths/assess'
import reportsPaths from '../paths/report'

export const sections = {
  applications: {
    id: 'applications',
    title: 'View your CAS-2 Bail applications',
    description: 'View all of your in progress and submitted CAS-2 Bail applications.',
    shortTitle: 'Applications',
    href: applyPaths.applications.index({}),
  },
  newApplication: {
    id: 'new-application',
    title: 'Start a new CAS-2 Bail application',
    description: '',
    shortTitle: 'New application',
    href: applyPaths.applications.beforeYouStart({}),
  },
  submittedApplications: {
    id: 'submitted-applications',
    title: 'Submitted applications',
    description: 'View all CAS-2 bail submitted applications',
    shortTitle: 'Submitted applications',
    href: assessPaths.submittedApplications.index.pattern,
  },
  managementInformationReports: {
    id: 'management-information-reports',
    title: 'Management information reports',
    description: 'View all CAS-2 bail management information reports to download',
    shortTitle: 'Management information reports',
    href: reportsPaths.report.new.pattern,
  },
}

export const hasRole = (userRoles: Array<string>, role: string): boolean => {
  return userRoles.includes(role)
}

export const sectionsForUser = (userRoles: Array<string>): Array<ServiceSection> => {
  const items = []

  if (hasRole(userRoles, 'POM') || hasRole(userRoles, 'LICENCE_CA')) {
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
