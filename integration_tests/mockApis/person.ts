import type { FullPerson } from '@approved-premises/api'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'

export default {
  stubFindPerson: (args: { person: FullPerson }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.search({ nomsNumber: args.person.nomsNumber }),
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.person,
      },
    }),

  stubPersonNotFound: (args: { person: FullPerson }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.search({ nomsNumber: args.person.nomsNumber }),
      },
      response: {
        status: 404,
      },
    }),

  stubFindPersonForbidden: (args: { person: FullPerson }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.search({ nomsNumber: args.person.nomsNumber }),
      },
      response: {
        status: 403,
      },
    }),
}
