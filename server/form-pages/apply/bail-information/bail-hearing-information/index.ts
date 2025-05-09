/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import BailHearingInformationPage from './bailHearingInformation'

@Task({
  name: 'Add bail hearing information',
  slug: 'bail-hearing-information',
  pages: [BailHearingInformationPage],
})
export default class BailHearingInformation {}
