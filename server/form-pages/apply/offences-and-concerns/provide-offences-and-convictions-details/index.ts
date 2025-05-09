/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import OffencesAndConvictionsGuidance from './offencesAndConvictionsGuidance'

@Task({
  name: 'Provide offences and convictions details',
  slug: 'provide-offences-and-convictions-details',
  pages: [OffencesAndConvictionsGuidance],
})
export default class ProvideOffencesAndConvictionsDetails {}
