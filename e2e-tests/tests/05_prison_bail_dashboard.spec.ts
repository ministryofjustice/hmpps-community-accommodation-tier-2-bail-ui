import test from '../test'
import {
  viewPrisonDashboard,
  viewApplicationOverview,
  viewApplicationAnswers,
  addNote,
  searchForCrnOrNomsNumber,
} from '../steps/apply'
import signIn from '../steps/signIn'

test("View and update another referrer's prison bail application", async ({ page, nomisPrisonUser2, person }) => {
  await signIn(page, nomisPrisonUser2)
  await viewPrisonDashboard(page)
  await viewApplicationOverview(page, person.name)
  await viewApplicationAnswers(page, person.name)
  await addNote(page)
})

test("Search for and view another referrer's prison bail application", async ({ page, nomisPrisonUser2, person }) => {
  await signIn(page, nomisPrisonUser2)
  await viewPrisonDashboard(page)
  await searchForCrnOrNomsNumber(page, person.crn)
  await viewApplicationOverview(page, person.name)
})
