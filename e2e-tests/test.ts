import { test as base } from '@playwright/test'

import { TestOptions } from './testOptions'

export default base.extend<TestOptions>({
  person: [
    {
      name: 'Ben Davies',
      crn: 'X371199',
      nomsNumber: 'A7779DY',
    },
    { option: true },
  ],
  personWithoutOasys: [
    {
      name: 'Leslie Fahey',
      crn: 'X698232',
      nomsNumber: 'A5275DZ',
    },
    { option: true },
  ],
  nomisCourtUser: [
    {
      name: 'Cas-two bail Test-nomis-court-user',
      username: process.env.CAS2_BAIL_NOMIS_COURT_USERNAME as string,
      password: process.env.CAS2_BAIL_NOMIS_COURT_PASSWORD as string,
    },
    { option: true },
  ],
  nomisPrisonUser: [
    {
      name: 'Cas-two bail Test-nomis-prison-user',
      username: process.env.CAS2_BAIL_NOMIS_PRISON_USERNAME as string,
      password: process.env.CAS2_BAIL_NOMIS_PRISON_PASSWORD as string,
    },
    { option: true },
  ],
  lcaUser: [
    {
      name: 'Licence Case-admin',
      username: process.env.CAS2_LCA_USERNAME as string,
      password: process.env.CAS2_LCA_PASSWORD as string,
    },
    { option: true },
  ],
  adminUser: [
    {
      name: 'CAS2 admin',
      username: process.env.CAS2_ADMIN_USERNAME as string,
      password: process.env.CAS2_ADMIN_PASSWORD as string,
    },
    { option: true },
  ],
  assessorUser: [
    {
      name: 'CAS2 assessor',
      username: process.env.CAS2_ASSESSOR_USERNAME as string,
      password: process.env.CAS2_ASSESSOR_PASSWORD as string,
    },
    { option: true },
  ],
  miUser: [
    {
      name: 'MI User',
      username: process.env.CAS2_MI_USERNAME as string,
      password: process.env.CAS2_MI_PASSWORD as string,
    },
    { option: true },
  ],
})
