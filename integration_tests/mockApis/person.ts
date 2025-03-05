import type { FullPerson } from '@approved-premises/api'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'

export default {
  stubFindPersonByPrisonNumber: (args: { person: FullPerson }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.searchByPrisonNumber({ nomsNumber: args.person.nomsNumber }),
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.person,
      },
    }),

  stubPersonByPrisonNumberNotFound: (args: { person: FullPerson }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.searchByPrisonNumber({ nomsNumber: args.person.nomsNumber }),
      },
      response: {
        status: 404,
      },
    }),

  stubFindPersonByPrisonNumberForbidden: (args: { person: FullPerson }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.searchByPrisonNumber({ nomsNumber: args.person.nomsNumber }),
      },
      response: {
        status: 403,
      },
    }),
  stubFindPersonByCrn: (args: { person: FullPerson }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.searchByCrn({ crn: args.person.crn }),
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.person,
      },
    }),

  stubPersonByCrnNotFound: (args: { person: FullPerson }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.searchByCrn({ crn: args.person.crn }),
      },
      response: {
        status: 404,
      },
    }),

  stubFindPersonByCrnForbidden: (args: { person: FullPerson }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.searchByCrn({ crn: args.person.crn }),
      },
      response: {
        status: 403,
      },
    }),
}
