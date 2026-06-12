import { Cas2CohortDto } from '@approved-premises/api'

export type NonBailCohort = Exclude<Cas2CohortDto, 'hdc' | 'prisonBail' | 'courtBail'>

export const cohortSelectionAnswers: Record<NonBailCohort, string> = {
  atcr: 'Alternative to custodial recall (ATCR)',
  hcrd: 'Homeless at conditional release date (HCRD)',
  hefr: 'Homeless at end of fixed term recall',
  isc: 'Intensive supervision courts (ISC)',
  rarr: 'Risk Assessed Recall Review (RARR)',
  from_ap: 'Referral from Approved Premises',
}
