import test from '../test'
import { viewPrisonDashboard, viewApplicationOverview, viewApplicationAnswers, addNote } from '../steps/apply'
import signIn from '../steps/signIn'

test("View and update another referrer's prison bail application", async ({ page, nomisPrisonUser, person }) => {
  await signIn(page, nomisPrisonUser)
  await viewPrisonDashboard(page)
  await viewApplicationOverview(page, person.name)
  await viewApplicationAnswers(page, person.name)
  await addNote(page)
})
