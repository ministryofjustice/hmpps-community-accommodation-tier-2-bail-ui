/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import ConfirmDetailsPage from './confirmDetails'
import ContactNumberPage from './contactNumber'
import JobTitlePage from './jobTitle'
import LocationPage from './location'
import CppCheck from './cppCheck'
import CppDetails from './cppDetails'

@Task({
  name: 'Add referrer details',
  slug: 'referrer-details',
  pages: [ConfirmDetailsPage, CppCheck, CppDetails, JobTitlePage, ContactNumberPage, LocationPage],
})
export default class ReferrerDetails {}
