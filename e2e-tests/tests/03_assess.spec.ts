import { expect } from '@playwright/test'
import { updateStatus, viewSubmittedApplication, addNote, addAssessmentDetails } from '../steps/assess'
import { test } from '../test'
import { signIn } from '../steps/signIn'

test('view a submitted application as an assessor', async ({ page, assessorUser }) => {
  // Expect failing test due to old application data
  // The first submitted application comes back as Person Not Found
  test.fail(Boolean(process.env.CI), 'Failing due to Person Not Found 404')

  await signIn(page, assessorUser)
  await viewSubmittedApplication(page)
  await updateStatus(page)
  await expect(page.locator('.moj-timeline__title').first()).toContainText('More information requested')
  await addNote(page)
  await addAssessmentDetails(page)
})
