/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CommunitySupervision from './communitySupervision'
import CPPDetails from './cppDetails'
import CurrentOffenceData from './custom-forms/currentOffenceData'
import CurrentOffencesIndexPage from './currentOffences'

@Task({
  name: 'Add probation supervision details',
  slug: 'community-supervision-and-current-offences',
  pages: [CommunitySupervision, CPPDetails, CurrentOffencesIndexPage, CurrentOffenceData],
})
export default class CommunitySupervisionAndCurrentOffences {}
