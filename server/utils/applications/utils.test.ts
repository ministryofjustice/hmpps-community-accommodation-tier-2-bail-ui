import { isAfter } from 'date-fns'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { Request, Response } from 'express'
import { applicationFactory, submittedApplicationFactory, timelineEventsFactory } from '../../testutils/factories'
import {
  getApplicationTimelineEvents,
  getSideNavLinksForDocument,
  getSideNavLinksForApplication,
  showMissingRequiredTasksOrTaskList,
  generateSuccessMessage,
} from './utils'
import { fetchErrorsAndUserInput } from '../validation'
import { DateFormats } from '../dateUtils'
import { getSections } from '../checkYourAnswersUtils'
import config from '../../config'
import paths from '../../paths/apply'
import { TaskListService } from '../../services'
import { formatLines, validateReferer } from '../viewUtils'

jest.mock('../../services/taskListService')
jest.mock('../checkYourAnswersUtils')
jest.mock('../../utils/validation')
jest.mock('../../utils/viewUtils')

const questionsAndAnswers = [
  {
    question: 'a question',
    answer: 'an answer',
  },
]
const pages = { page1: {}, page2: {} }
const mockSections = [
  {
    title: 'Section 1',
    tasks: [
      {
        id: 'task1',
        title: 'Task 1',
        pages,
        questionsAndAnswers,
      },
      {
        id: 'task2',
        title: 'Task 2',
        pages,
        questionsAndAnswers,
      },
    ],
  },
  {
    title: 'Section 2',
    tasks: [
      {
        id: 'task3',
        title: 'Task 3',
        pages,
        questionsAndAnswers,
      },
      {
        id: 'task4',
        title: 'Task 4',
        pages,
        questionsAndAnswers,
      },
    ],
  },
]

describe('utils', () => {
  describe('getApplicationTimelineEvents', () => {
    const priorConfigFlags = config.flags

    afterAll(() => {
      config.flags = priorConfigFlags
    })

    describe('when there are timeline events', () => {
      it('returns them in the timeline events', () => {
        const application = submittedApplicationFactory.build({
          timelineEvents: [
            timelineEventsFactory.build({
              label: 'a status update',
              body: 'the status description',
              createdByName: 'A Nacro',
              occurredAt: '2023-06-22T08:54:50',
            }),
            timelineEventsFactory.build({
              type: 'cas2_application_submitted',
              label: 'Application submitted',
              body: 'The application was received by an assessor.',
              createdByName: 'Anne Nomis',
              occurredAt: '2023-06-21T07:54:50',
            }),
          ],
        })

        ;(formatLines as jest.MockedFunction<typeof formatLines>).mockReturnValue(
          'The application was received by an assessor.',
        )

        expect(getApplicationTimelineEvents(application)).toEqual([
          {
            byline: {
              text: 'A Nacro',
            },
            datetime: {
              date: '22 June 2023 at 08:54am',
              timestamp: '2023-06-22T08:54:50',
            },
            description: {
              text: 'the status description',
            },
            label: {
              text: 'a status update',
            },
          },
          {
            byline: {
              text: 'Anne Nomis',
            },
            datetime: {
              date: '21 June 2023 at 07:54am',
              timestamp: '2023-06-21T07:54:50',
            },
            description: {
              text: 'The application was received by an assessor.',
            },
            label: {
              text: 'Application submitted',
            },
          },
        ])
      })

      it('sorts the events in ascending order', () => {
        const application = submittedApplicationFactory.build({
          timelineEvents: [
            timelineEventsFactory.build({
              label: 'a status update',
              body: 'the status description',
              createdByName: 'A Nacro',
              occurredAt: '2023-06-22T08:54:50',
            }),
            timelineEventsFactory.build({
              label: 'a status update',
              body: 'the status description',
              createdByName: 'A Nacro',
              occurredAt: '2023-06-27T08:54:50',
            }),
            timelineEventsFactory.build({
              label: 'a status update',
              body: 'the status description',
              createdByName: 'A Nacro',
              occurredAt: '2023-06-20T08:54:50',
            }),
            timelineEventsFactory.build({
              type: 'cas2_application_submitted',
              label: 'Application submitted',
              body: 'The application was received by an assessor.',
              createdByName: 'Anne Nomis',
              occurredAt: '2023-06-19T07:54:50',
            }),
          ],
        })

        const actual = getApplicationTimelineEvents(application)

        expect(
          isAfter(
            DateFormats.isoToDateObj(actual[0].datetime.timestamp),
            DateFormats.isoToDateObj(actual[1].datetime.timestamp),
          ),
        ).toEqual(true)

        expect(
          isAfter(
            DateFormats.isoToDateObj(actual[0].datetime.timestamp),
            DateFormats.isoToDateObj(actual[2].datetime.timestamp),
          ),
        ).toEqual(true)

        expect(
          isAfter(
            DateFormats.isoToDateObj(actual[1].datetime.timestamp),
            DateFormats.isoToDateObj(actual[2].datetime.timestamp),
          ),
        ).toEqual(true)
      })

      describe('when the timeline event is a status update', () => {
        it('formats the description text', () => {
          const application = submittedApplicationFactory.build({
            timelineEvents: [
              timelineEventsFactory.build({
                body: 'the status description, and another, and another',
              }),
            ],
          })
          expect(getApplicationTimelineEvents(application)[0].description.text).toEqual(
            'the status description<br>and another<br>and another',
          )
        })
      })

      describe('when there are no timeline events', () => {
        it('returns an empty array', () => {
          const application = submittedApplicationFactory.build({
            timelineEvents: undefined,
          })
          expect(getApplicationTimelineEvents(application)).toEqual([])
        })
      })
    })
  })

  describe('getSideNavLinksForDocument', () => {
    it('returns an array with a side nav item for each task', () => {
      const document = {
        sections: mockSections,
      }

      expect(getSideNavLinksForDocument(document)).toEqual([
        { text: 'Task 1', href: '#task-1' },
        { text: 'Task 2', href: '#task-2' },
        { text: 'Task 3', href: '#task-3' },
        { text: 'Task 4', href: '#task-4' },
      ])
    })
  })

  describe('getSideNavLinksForApplication', () => {
    it('returns an array with a side nav item for each task', () => {
      ;(getSections as jest.Mock).mockReturnValue(mockSections)

      expect(getSideNavLinksForApplication()).toEqual([
        { text: 'Task 1', href: '#task-1' },
        { text: 'Task 2', href: '#task-2' },
        { text: 'Task 3', href: '#task-3' },
        { text: 'Task 4', href: '#task-4' },
      ])
    })
  })

  describe('showMissingRequiredTasksOrTaskList', () => {
    const request: DeepMocked<Request> = createMock<Request>({ user: { token: 'SOME_TOKEN' } })
    const response: DeepMocked<Response> = createMock<Response>({})
    const mockTaskList = {
      formSections: mockSections,
      taskStatuses: { task1: 'not_started', task2: 'not_started' },
      requiredTasks: { task1: ['not_started'], task2: ['not_started'] },
    }

    describe('when "Confirm eligibility" task is NOT complete', () => {
      it('renders "Confirm eligibility" page from the "Before you start" section', async () => {
        const application = applicationFactory.build({ data: {} })
        ;(TaskListService as jest.Mock).mockImplementation(() => mockTaskList)

        showMissingRequiredTasksOrTaskList(request, response, application)

        expect(response.redirect).toHaveBeenCalledWith(`/applications/${application.id}/tasks/task1/pages/page1`)
      })
    })

    describe('when "Confirm eligibility" task is complete and the candidate is INELIGIBLE', () => {
      it('renders the "ineligible" page', async () => {
        const application = applicationFactory.build({
          id: 'appId',
          data: {
            'confirm-eligibility': {
              'confirm-eligibility': { isEligible: 'no' },
            },
          },
        })

        showMissingRequiredTasksOrTaskList(request, response, application)

        expect(response.redirect).toHaveBeenCalledWith(paths.applications.ineligible({ id: application.id }))
      })
    })

    describe('when the person is confirmed ELIGIBLE but the consent task has not been completed', () => {
      it('redirects to the _confirm consent_ page', async () => {
        const application = applicationFactory.build({
          id: 'app-id',
          data: {
            'confirm-eligibility': {
              'confirm-eligibility': { isEligible: 'yes' },
            },
          },
        })
        ;(TaskListService as jest.Mock).mockImplementation(() => ({
          ...mockTaskList,
          taskStatuses: { task1: 'complete', task2: 'not_started' },
        }))

        showMissingRequiredTasksOrTaskList(request, response, application)

        expect(response.redirect).toHaveBeenCalledWith('/applications/app-id/tasks/task2/pages/page1')
      })
    })

    describe('when the person is confirmed ELIGIBLE and there is a key for "Confirm consent" data, indicating that the page has been completed', () => {
      let thisMockTaskList: unknown

      beforeEach(() => {
        jest.resetAllMocks()
        thisMockTaskList = {
          ...mockTaskList,
          taskStatuses: { task1: 'complete', task2: 'complete', task3: 'complete', task4: 'not_started' },
        }
        ;(TaskListService as jest.Mock).mockImplementation(() => thisMockTaskList)
        ;(fetchErrorsAndUserInput as jest.Mock).mockImplementation(() => {
          return { errors: {}, errorSummary: [], userInput: {} }
        })
        ;(validateReferer as jest.MockedFunction<typeof validateReferer>).mockReturnValue('some-validated-referer')
      })
      it('redirects to the task list page', async () => {
        const application = applicationFactory.build({
          id: 'app-id',
        })

        showMissingRequiredTasksOrTaskList(request, response, application)

        expect(response.render).toHaveBeenCalledWith('applications/taskList', {
          application,
          taskList: thisMockTaskList,
          errorSummary: [],
          errors: {},
          referer: 'some-validated-referer',
          title: 'Apply for CAS2 for Bail',
        })
      })

      it('includes the cohort for non-bail applications', async () => {
        const application = applicationFactory.newCohort('isc').build({
          id: 'app-id',
        })
        showMissingRequiredTasksOrTaskList(request, response, application)

        expect(response.render).toHaveBeenCalledWith('applications/taskList', {
          application,
          cohortLabel: 'Intensive supervision courts (ISC)',
          taskList: thisMockTaskList,
          errorSummary: [],
          errors: {},
          referer: 'some-validated-referer',
          title: 'Apply for CAS2',
        })
      })
    })
  })

  describe('generateSuccessMessage', () => {
    it('returns message', () => {
      expect(generateSuccessMessage('add-acct-note')).toEqual('The ACCT has been saved')
      expect(generateSuccessMessage('unknown')).toEqual('')
    })
  })
})
