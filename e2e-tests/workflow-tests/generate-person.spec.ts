/* eslint-disable no-console */
import { writeFileSync } from 'node:fs'
import { test } from '@playwright/test'
import { createTestPerson } from '../setup/person'

const outputFile = process.env.CRN_OUTPUT_FILE

test('generate one test person', async ({ browser }) => {
  test.setTimeout(4 * 60 * 1000)

  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    const person = await createTestPerson(page)
    const result = {
      name: person.name,
      crn: person.crn,
    }

    if (outputFile) {
      writeFileSync(outputFile, JSON.stringify(result, null, 2))
    }

    console.log(`Generated person: ${JSON.stringify(result)}`)
  } finally {
    await context.close()
  }
})
