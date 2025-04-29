/* istanbul ignore file */

import { Section } from '../../utils/decorators'
import BailConditions from './bail-conditions'
import BailHearingInformation from './bail-hearing-information'

@Section({
  title: 'Bail information',
  tasks: [BailConditions, BailHearingInformation],
})
export default class BailInformation {}
