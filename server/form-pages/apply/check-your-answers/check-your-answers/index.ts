/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CheckYourAnswersPage from './checkYourAnswers'

@Task({
  name: 'Check application answers',
  slug: 'check-your-answers',
  pages: [CheckYourAnswersPage],
})
export default class CheckYourAnswers {}
