import path from 'path'
import { pactWith } from 'jest-pact'
import { Pact } from '@pact-foundation/pact'

import config from '../config'

const describeClient = (consumer: string, fn: (provider: Pact) => void) => {
  const provider = 'API'
  const dir = path.join(__dirname, '..', '..', 'tmp', 'pacts')

  describe(consumer, () => {
    pactWith({ consumer, provider, dir }, pact => {
      beforeEach(() => {
        config.apis.approvedPremises.url = pact.mockService.baseUrl
      })

      fn(pact)
    })

    // Temporarily disable test due to swagger-mock-validator error
    xit('meets the contract for the service', () => {
      const pactPath = `${dir}/${consumer}-${provider}.json`
      expect(pactPath).toMatchOpenAPISpec()
    })
  })
}

export default describeClient
