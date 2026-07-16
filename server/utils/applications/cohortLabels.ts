import { Cas2CohortDto } from '@approved-premises/api'

export type NonBailCohort = Exclude<Cas2CohortDto, 'hdc' | 'prisonBail' | 'courtBail'>

export const newCohortLabels: Record<NonBailCohort, string> = {
  atcr: 'Alternative to custodial recall (ATCR)',
  hcrd: 'Homeless at conditional release date (HCRD)',
  hefr: 'Homeless at end of fixed-term recall',
  isc: 'Intensive supervision courts (ISC)',
  rarr: 'Risk Assessed Recall Review (RARR)',
  from_ap: 'Referral from Approved Premises',
}

export const cohortLabels: Record<Cas2CohortDto, string> = {
  hdc: 'Home Detention Curfew',
  prisonBail: 'Prison Bail',
  courtBail: 'Court Bail',
  ...newCohortLabels,
}

export const cohortLabel = (cohort?: Cas2CohortDto): string => (cohort ? (cohortLabels[cohort] ?? cohort) : '')

export const custodialCohorts: Array<Cas2CohortDto> = ['rarr', 'hcrd', 'hefr', 'hdc', 'prisonBail', 'courtBail']
