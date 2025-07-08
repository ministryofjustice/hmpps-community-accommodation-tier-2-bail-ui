/* eslint-disable @typescript-eslint/no-namespace */

import { execSync } from 'child_process'
import path from 'path'
import { diffStringsUnified } from 'jest-diff'

export {}

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchStringIgnoringWhitespace(expected: string): R
      toMatchOpenAPISpec(): R
    }
  }
}

expect.extend({
  toMatchStringIgnoringWhitespace(received, expected) {
    const pass = received.replace(/\s+/g, ``) === expected.replace(/\s+/g, ``)

    return {
      pass,
      message: pass
        ? () => `expected received not to match expected ${diffStringsUnified(expected, received)}`
        : () => `expected received to match expected ${diffStringsUnified(expected, received)}`,
    }
  },
  toMatchOpenAPISpec(pactPath) {
    const openAPIUrl = 'https://approved-premises-api-dev.hmpps.service.justice.gov.uk/v3/api-docs/CAS2v2Shared'

    const openAPIPath = path.join(__dirname, '..', '..', 'tmp', 'cas2v2-api.yml')

    try {
      execSync(`
        if [ ! -f ${openAPIPath} ]; then
          curl -s "${openAPIUrl}" |
          sed -E 's@/applications@/cas2v2/applications@g' |
          sed -E 's@/submissions@/cas2v2/submissions@g' |
          sed -E 's@/assessments@/cas2v2/assessments@g' |
          sed -E 's@/people@/cas2v2/people@g' |
          sed -E 's@/reports@/cas2v2/reports@g' |
          sed -E 's@/reference-data/@/cas2v2/reference-data/@g' > ${openAPIPath}
        fi
      `)

      execSync(`npx swagger-mock-validator ${openAPIPath} ${pactPath}`)
      return {
        message: () => `Swagger mock validator for ${pactPath} did not fail`,
        pass: true,
      }
    } catch (err) {
      return {
        message: () => err.output.toString(),
        pass: false,
      }
    }
  },
})
