/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CommunitySupervision from './communitySupervision'
import CPPDetails from './cppDetails'
import CurrentOffenceData from './custom-forms/currentOffenceData'
import CurrentOffencesIndexPage from './currentOffences'

@Task({
  name: 'Community supervision and current offences',
  slug: 'community-supervision-and-current-offences',
  pages: [CommunitySupervision, CPPDetails, CurrentOffencesIndexPage, CurrentOffenceData],
})
export default class CommunitySupervisionAndCurrentOffences {}
