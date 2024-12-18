/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import BailConditionsAndSupportSessions from './bail-conditions-and-support-sessions'
import BailHearingInformation from './bail-hearing-information'

@Section({
  title: 'Bail information',
  tasks: [BailConditionsAndSupportSessions, BailHearingInformation],
})
export default class BailInformation {}
