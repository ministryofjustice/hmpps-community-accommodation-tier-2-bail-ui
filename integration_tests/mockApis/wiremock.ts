import superagent, { SuperAgentRequest, Response } from 'superagent'

const wiremockEndpoint = 'http://localhost:9999'

const url = `${wiremockEndpoint}/__admin`

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${url}/mappings`).send(mapping)

const getMatchingRequests = body => superagent.post(`${url}/requests/find`).send(body)

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

export { stubFor, getMatchingRequests, resetStubs }
