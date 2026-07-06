import type {
  Cas2OAsysRiskToSelfDto,
  Cas2OAsysRoshRatingsDto,
  Cas2OAsysRoshSummaryDto,
  FullPerson,
} from '@approved-premises/api'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'

export default {
  stubOasysRoshSummary: (args: { crn: string; summary: Cas2OAsysRoshSummaryDto }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.oasys.roshSummary({ crn: args.crn }),
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.summary,
      },
    }),

  stubOasysRoshRatings: (args: { crn: string; ratings: Cas2OAsysRoshRatingsDto }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.oasys.roshRatings({ crn: args.crn }),
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.ratings,
      },
    }),

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

  stubGetOasysRiskToSelf: (args: { person: FullPerson; data: Cas2OAsysRiskToSelfDto }) =>
    stubFor({
      request: {
        method: 'GET',
        url: paths.people.oasys.riskToSelf({ crn: args.person.crn }),
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.data,
      },
    }),
}
