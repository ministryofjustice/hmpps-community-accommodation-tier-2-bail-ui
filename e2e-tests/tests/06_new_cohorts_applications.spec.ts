import test from '../test'
import signIn from '../steps/signIn'
import { selectApplicationOrigin, startANewCohortApplication } from '../steps/apply'

test('Create a CAS2 bail application', async ({ page, deliusPrisonUser }) => {
  await signIn(page, deliusPrisonUser)
  await startANewCohortApplication(page)
  await selectApplicationOrigin(page, 'bail')
})

test('Create a different CAS2 application', async ({ page, deliusPrisonUser }) => {
  await signIn(page, deliusPrisonUser)
  await startANewCohortApplication(page)
  await selectApplicationOrigin(page, 'other')
})
