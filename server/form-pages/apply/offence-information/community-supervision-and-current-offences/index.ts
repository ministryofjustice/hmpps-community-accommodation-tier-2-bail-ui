/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CommunitySupervision from './communitySupervision'
import CPPDetails from './cppDetails'

@Task({
  name: 'Add probation supervision details',
  slug: 'community-supervision-and-current-offences',
  pages: [CommunitySupervision, CPPDetails],
})
export default class CommunitySupervisionAndCurrentOffences {}
