// Ambient module declarations for the subset of
// `@ministryofjustice/hmpps-probation-integration-e2e-tests` used by this project. The package ships real
// `.d.mts` type declarations, but this project's `moduleResolution: "node"` cannot resolve subpath exports
// that only provide `.mjs`/`.d.mts` files, so we declare the shapes we rely on here instead.
declare module '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person' {
  export interface Person {
    firstName: string
    lastName: string
    sex: string
    dob: Date
    pnc?: string
    ethnicity?: string
    croNumber?: string
  }
  export const deliusPerson: (person?: Partial<Person>) => Person
}

declare module '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender' {
  import type { Page } from '@playwright/test'
  import type { Person } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person'

  export function createOffender(page: Page, args?: { person?: Person; providerName?: string }): Promise<string>
}
