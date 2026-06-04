import { QuestionAndAnswer } from '@approved-premises/ui'

import { UnspentConvictionsUI } from '../form-pages/apply/offences-and-concerns/previous-unspent-convictions/unspentConvictions'
import { applicationFactory, applicationSummaryFactory } from '../testutils/factories'

import {
  documentSummaryListRows,
  inProgressApplicationTableRows,
  submittedApplicationTableRows,
  prisonApplicationTableRows,
  assessmentsTableRows,
  getStatusTag,
  arePreTaskListTasksIncomplete,
  unspentConvictionsCardRows,
} from './applicationUtils'
import submittedApplicationSummary from '../testutils/factories/submittedApplicationSummary'
import { summaryListItem } from './formUtils'

describe('inProgressApplicationTableRows', () => {
  it('returns an array of applications as table rows', async () => {
    const applicationA = applicationSummaryFactory.build({
      personName: 'A',
      createdAt: '2022-11-10T21:47:28Z',
      status: 'inProgress',
      latestStatusUpdate: null,
      cohort: 'atcr',
    })
    const applicationB = applicationSummaryFactory.build({
      personName: 'B',
      createdAt: '2022-11-11T21:47:28Z',
      status: 'inProgress',
      latestStatusUpdate: null,
      cohort: 'isc',
    })

    const result = inProgressApplicationTableRows([applicationA, applicationB])

    expect(result).toEqual([
      [
        {
          html: `<a href=/applications/${applicationA.id} data-cy-id="${applicationA.id}">A</a>`,
        },
        {
          text: applicationA.nomsNumber,
        },
        {
          text: applicationA.crn,
        },
        {
          text: '10 November 2022',
        },
        {
          text: 'Alternative to custodial recall',
        },
        {
          html: `<a id="cancel-${applicationA.id}" href=/applications/${applicationA.id}/cancel>Cancel</a>`,
        },
        {
          html: '<strong class="govuk-tag govuk-tag--light-blue">In progress</strong>',
        },
      ],
      [
        {
          html: `<a href=/applications/${applicationB.id} data-cy-id="${applicationB.id}">B</a>`,
        },
        {
          text: applicationB.nomsNumber,
        },
        {
          text: applicationB.crn,
        },
        {
          text: '11 November 2022',
        },
        {
          text: 'Intensive supervision courts',
        },
        {
          html: `<a id="cancel-${applicationB.id}" href=/applications/${applicationB.id}/cancel>Cancel</a>`,
        },
        {
          html: '<strong class="govuk-tag govuk-tag--light-blue">In progress</strong>',
        },
      ],
    ])
  })
})

describe('submittedApplicationTableRows', () => {
  it('returns an array of applications as table rows', async () => {
    const applicationA = applicationSummaryFactory.build({
      personName: 'A',
      submittedAt: '2022-12-10T21:47:28Z',
      cohort: 'courtBail',
    })
    const applicationB = applicationSummaryFactory.build({
      personName: 'B',
      submittedAt: '2022-12-11T21:47:28Z',
      cohort: 'prisonBail',
    })

    const result = submittedApplicationTableRows([applicationA, applicationB])

    expect(result).toEqual([
      [
        {
          html: `<a href=/applications/${applicationA.id}/overview data-cy-id="${applicationA.id}">A</a>`,
        },
        {
          text: applicationA.nomsNumber,
        },
        {
          text: applicationA.crn,
        },
        {
          text: '10 December 2022',
        },
        {
          text: 'Court Bail',
        },
        {
          html: '<strong class="govuk-tag govuk-tag--light-blue">More information requested</strong>',
        },
      ],
      [
        {
          html: `<a href=/applications/${applicationB.id}/overview data-cy-id="${applicationB.id}">B</a>`,
        },
        {
          text: applicationB.nomsNumber,
        },
        {
          text: applicationB.crn,
        },
        {
          text: '11 December 2022',
        },
        {
          text: 'Prison Bail',
        },
        {
          html: '<strong class="govuk-tag govuk-tag--light-blue">More information requested</strong>',
        },
      ],
    ])
  })
})

describe('prisonApplicationTableRows', () => {
  it('returns an array of applications as table rows', async () => {
    const applicationA = applicationSummaryFactory.build({
      personName: 'A',
      submittedAt: '2022-12-10T21:47:28Z',
      cohort: 'prisonBail',
    })
    const applicationB = applicationSummaryFactory.build({
      personName: 'B',
      submittedAt: '2022-12-11T21:47:28Z',
      cohort: 'prisonBail',
    })

    const result = prisonApplicationTableRows([applicationA, applicationB])

    expect(result).toEqual([
      [
        {
          html: `<a href=/applications/${applicationA.id}/overview data-cy-id="${applicationA.id}">A</a>`,
        },
        {
          text: applicationA.nomsNumber,
        },
        {
          text: applicationA.prisonCode,
        },
        {
          text: applicationA.crn,
        },
        {
          text: applicationA.createdByUserName,
        },
        {
          text: 'Prison Bail',
        },
        {
          html: '<strong class="govuk-tag govuk-tag--light-blue">More information requested</strong>',
        },
      ],
      [
        {
          html: `<a href=/applications/${applicationB.id}/overview data-cy-id="${applicationB.id}">B</a>`,
        },
        {
          text: applicationB.nomsNumber,
        },
        {
          text: applicationB.prisonCode,
        },
        {
          text: applicationB.crn,
        },
        {
          text: applicationB.createdByUserName,
        },
        {
          text: 'Prison Bail',
        },
        {
          html: '<strong class="govuk-tag govuk-tag--light-blue">More information requested</strong>',
        },
      ],
    ])
  })
})

describe('assessmentsTableRows', () => {
  it('returns an array of applications as table rows', async () => {
    const applicationA = submittedApplicationSummary.build({
      submittedAt: '2022-12-10T21:47:28Z',
      personName: 'A',
    })
    const applicationB = submittedApplicationSummary.build({
      submittedAt: '2022-12-11T21:47:28Z',
      personName: 'B',
    })

    const result = assessmentsTableRows([applicationA, applicationB])

    expect(result).toEqual([
      [
        {
          html: `<a href=/assess/applications/${applicationA.id}/overview data-cy-id="${applicationA.id}">A</a>`,
        },
        {
          text: applicationA.nomsNumber,
        },
        {
          text: applicationA.crn,
        },
        {
          text: '10 December 2022',
        },
      ],
      [
        {
          html: `<a href=/assess/applications/${applicationB.id}/overview data-cy-id="${applicationB.id}">B</a>`,
        },
        {
          text: applicationB.nomsNumber,
        },
        {
          text: applicationB.crn,
        },
        {
          text: '11 December 2022',
        },
      ],
    ])
  })
})

describe('documentSummaryListRows', () => {
  it('returns an array of summary list rows', () => {
    const questionsAndAnswers: Array<QuestionAndAnswer> = [
      { question: 'Question 1', answer: 'Answer 1' },
      { question: 'Question 2', answer: 'Answer 2' },
    ]
    const rows = documentSummaryListRows(questionsAndAnswers)
    expect(rows).toEqual([
      {
        key: { html: 'Question 1' },
        value: { html: 'Answer 1' },
      },
      {
        key: { html: 'Question 2' },
        value: { html: 'Answer 2' },
      },
    ])
  })
})

describe('getStatusTag', () => {
  it('returns the correct HTML string', () => {
    const expected = `<strong class="govuk-tag govuk-tag--light-blue">More information requested</strong>`
    expect(getStatusTag('More information requested', 'f5cd423b-08eb-4efb-96ff-5cc6bb073905')).toEqual(expected)
  })

  it('returns the Received string if status is undefined', () => {
    const expected = `<strong class="govuk-tag govuk-tag--grey">Received</strong>`
    expect(getStatusTag(undefined, undefined)).toEqual(expected)
  })
})

describe('arePreTaskListTasksIncomplete', () => {
  const eligibility = { 'confirm-eligibility': { 'confirm-eligibility': { isEligible: 'yes' } } }
  const consent = { 'confirm-consent': { 'confirm-consent': { hasGivenConsent: 'yes' } } }
  const cohort = { 'cohort-selection': { 'cohort-selection': { cohort: 'hefr' } } }

  it('returns true there are data for none of the tasks', () => {
    const application = applicationFactory.build({
      data: {},
      applicationOrigin: 'prisonBail',
    })
    expect(arePreTaskListTasksIncomplete(application)).toEqual(true)
  })

  it('returns false if a bail application and there are data for both bail tasks', () => {
    const application = applicationFactory.build({
      data: { ...eligibility, ...consent },
      applicationOrigin: 'prisonBail',
    })
    expect(arePreTaskListTasksIncomplete(application)).toEqual(false)
  })

  it('returns true if an other application and there are data for both bail tasks', () => {
    const application = applicationFactory.build({
      data: { ...eligibility, ...consent },
      applicationOrigin: 'other',
    })
    expect(arePreTaskListTasksIncomplete(application)).toEqual(true)
  })

  it('returns false if an other cohort application and there are data for all of the other cohort tasks', () => {
    const application = applicationFactory.build({
      data: { ...eligibility, ...consent, ...cohort },
      applicationOrigin: 'other',
    })
    expect(arePreTaskListTasksIncomplete(application)).toEqual(false)
  })
})

describe('unspentConvictionsCardRows', () => {
  it('returns an array of summary list items for an unspent conviction', () => {
    const conviction = {
      convictionTypeTag: null,
      convictionTypeText: null,
      numberOfConvictions: '2',
      currentlyServing: 'Yes',
      convictionDetails: 'some details about the convictions',
      otherDetails: 'some other details',
      removeLink: null,
    } as UnspentConvictionsUI

    expect(unspentConvictionsCardRows(conviction)).toEqual([
      summaryListItem('Number of convictions of the same type', '2'),
      summaryListItem('Are they currently serving a sentence for these convictions?', 'Yes'),
      summaryListItem('What were the convictions and when did they happen?', 'some details about the convictions'),
      summaryListItem('Are there any other details about these convictions to add?', 'some other details'),
    ])
  })
})
