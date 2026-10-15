import { ApplicationOrigin, Cas2Application, Cas2CohortDto, Cas2SubmittedApplication } from '@approved-premises/api'

export type NonBailCohort = Exclude<Cas2CohortDto, 'hdc' | 'prisonBail' | 'courtBail'>

export const newCohortLabels: Record<NonBailCohort, string> = {
  hcrd: 'Homeless at Conditional Release Date (HCRD)',
  hefr: 'Homeless following Fixed Term Recall (HFTR)',
  rarr: 'Risk Assessed Recall Review (RARR)',
  from_ap: 'Move-on from Approved Premises (CAS1)',
  atcr: 'Alternative to Custodial Recall (ATCR)',
  isc: 'Intensive Supervision Courts (ISC)',
}

export const newCohortHints: Record<NonBailCohort, string> = {
  hcrd: 'Person is currently in prison but will be released as homeless on their conditional release date.',
  hefr: 'Person was sent back to prison for a period of time and will be released as homeless after their recall.',
  rarr: 'Person is in prison because of a recall but could be re-released without referral to a parole board.',
  from_ap: 'Person is in Approved Premises but no longer needs the public protection measures that an AP provides.',
  atcr: 'Person is in the community but at risk of being recalled due to a breakdown of accommodation.',
  isc: 'Person has been sentenced to an Intensive Supervision order as part of the ISC scheme.',
}

export const cohortLabels: Record<Cas2CohortDto, string> = {
  hdc: 'Home Detention Curfew',
  prisonBail: 'Prison Bail',
  courtBail: 'Court Bail',
  ...newCohortLabels,
}

export const cohortLabel = (cohort?: Cas2CohortDto): string => (cohort ? (cohortLabels[cohort] ?? cohort) : '')

export const custodialCohorts: Array<Cas2CohortDto> = ['rarr', 'hcrd', 'hefr', 'hdc', 'prisonBail', 'courtBail']

export const bailCohorts: Partial<Record<ApplicationOrigin, Cas2CohortDto>> = {
  courtBail: 'courtBail',
  prisonBail: 'prisonBail',
}

// fallback for pre-cohorts!
export const applicationTypeLabel = (application: Cas2Application | Cas2SubmittedApplication): string =>
  cohortLabel(application.cohort) || cohortLabel(bailCohorts[application.applicationOrigin])
