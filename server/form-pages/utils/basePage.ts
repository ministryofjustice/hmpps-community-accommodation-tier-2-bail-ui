import type { TaskListErrors } from '@approved-premises/ui'
import TaskListPage from '../taskListPage'
import { DateFormats } from '../../utils/dateUtils'
import { Question } from './questions'

export default class BasePage implements TaskListPage {
  documentTitle: string

  title: string

  body: Record<string, unknown>

  questions: Record<string, Question>

  previous() {
    return ''
  }

  next() {
    return ''
  }

  errors() {
    return [] as TaskListErrors<this>
  }

  response() {
    return Object.entries(this.questions).reduce((out, [key, question]) => {
      let value: string = this.body[key] as string
      if (question?.dataType === 'date') {
        try {
          value = DateFormats.dateAndTimeInputsToUiDate(this.body as Record<string, string>, key)
        } catch {
          // ignore
        }
      }
      if (question?.answers) {
        value = question.answers[value]
      }
      return !question || value === undefined ? out : { ...out, [question?.question]: value }
    }, {}) as Record<string, string>
  }
}
