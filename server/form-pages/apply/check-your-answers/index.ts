/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import CheckYourAnswersTask from './check-your-answers'

@Section({
  title: 'Check answers',
  tasks: [CheckYourAnswersTask],
})
export default class CheckYourAnswers {}
