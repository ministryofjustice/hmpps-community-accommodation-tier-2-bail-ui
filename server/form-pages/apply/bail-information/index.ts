/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import BailConditionsAndSupportSessions from './bail-conditions-and-support-sessions'
import BailHearingInformation from './bail-hearing-information'
import BailHearingArrangementInformation from './bail-hearing-arrangement'

@Section({
  title: 'Bail information',
  tasks: [BailConditionsAndSupportSessions, BailHearingInformation, BailHearingArrangementInformation],
})
export default class BailInformation {}
