import { buildDocument, filterDocumentToApplicableTasks } from './documentUtils'
import { applicationFactory } from '../../testutils/factories'
import { getSections, getTaskAnswersAsSummaryListItems, taskAppliesToApplication } from '../checkYourAnswersUtils'

jest.mock('../checkYourAnswersUtils')

const questionAndAnswer = { question: 'Question', answer: 'Answer' }

const applicableTask = { title: 'Applicable task' }
const notApplicableTask = { title: 'Not applicable task' }

describe('documentUtils', () => {
  const application = applicationFactory.build()

  beforeEach(() => {
    ;(getTaskAnswersAsSummaryListItems as jest.Mock).mockReturnValue([questionAndAnswer])
    ;(getSections as jest.Mock).mockReturnValue([
      { title: 'Mixed section', name: 'mixed-section', tasks: [applicableTask, notApplicableTask] },
      { title: 'Not applicable section', name: 'not-applicable-section', tasks: [notApplicableTask] },
    ])
    ;(taskAppliesToApplication as jest.Mock).mockImplementation(task => task === applicableTask)
  })

  describe('buildDocument', () => {
    it('includes only the tasks that apply to the application', () => {
      expect(buildDocument(application)).toEqual({
        sections: [
          {
            title: 'Mixed section',
            tasks: [{ title: 'Applicable task', questionsAndAnswers: [questionAndAnswer] }],
          },
        ],
      })
    })
  })

  describe('filterDocumentToApplicableTasks', () => {
    it('removes tasks that do not apply to the application', () => {
      const submittedApplication = applicationFactory.build({
        document: {
          sections: [
            {
              title: 'Mixed section',
              tasks: [
                { title: 'Applicable task', questionsAndAnswers: [questionAndAnswer] },
                { title: 'Not applicable task', questionsAndAnswers: [] },
              ],
            },
            {
              title: 'Not applicable section',
              tasks: [{ title: 'Not applicable task', questionsAndAnswers: [] }],
            },
          ],
        },
      })

      expect(filterDocumentToApplicableTasks(submittedApplication)).toEqual({
        sections: [
          {
            title: 'Mixed section',
            tasks: [{ title: 'Applicable task', questionsAndAnswers: [questionAndAnswer] }],
          },
        ],
      })
    })
  })
})
