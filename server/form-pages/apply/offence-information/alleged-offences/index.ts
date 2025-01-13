/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import AllegedOffenceData from './custom-forms/allegedOffenceData'
import AllegedOffencesIndexPage from './allegedOffences'

@Task({
  name: 'Add alleged offences',
  slug: 'alleged-offences',
  pages: [AllegedOffencesIndexPage, AllegedOffenceData],
})
export default class AllegedOffences {}
