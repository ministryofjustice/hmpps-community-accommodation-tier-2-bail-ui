/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import AllegedOffenceData from './custom-forms/allegedOffenceData'
import AllegedOffencesIndexPage from './allegedOffences'
import AllegedOffencesSummary from './allegedOffencesSummary'

@Task({
  name: 'Add alleged offences',
  slug: 'alleged-offences',
  pages: [AllegedOffencesIndexPage, AllegedOffenceData, AllegedOffencesSummary],
})
export default class AllegedOffences {}
