import test from '../test'
import viewPrisonDashboard from '../steps/prisonDashboard'
import signIn from '../steps/signIn'

test('View all prison bail applications', async ({ page, nomisPrisonUser, person }) => {
  await signIn(page, nomisPrisonUser)
  await viewPrisonDashboard(page, person.name)
})
