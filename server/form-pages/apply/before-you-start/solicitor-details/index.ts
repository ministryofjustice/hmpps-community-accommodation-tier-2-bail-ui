/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import ContactInformation from './contactInformation'

@Task({
  name: 'Add solicitor details',
  slug: 'solicitor-details',
  pages: [ContactInformation],
})
export default class SolicitorDetails {}
