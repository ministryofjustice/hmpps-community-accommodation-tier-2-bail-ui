/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import WorkingMobilePhone from './workingMobilePhone'
import ImmigrationStatus from './immigrationStatus'
import PregnancyInformation from './pregnancyInformation'
import SupportWorkerPreference from './supportWorkerPreference'
import Gender from './gender'

@Task({
  name: 'Add personal information',
  slug: 'personal-information',
  pages: [WorkingMobilePhone, ImmigrationStatus, Gender, PregnancyInformation, SupportWorkerPreference],
})
export default class PersonalInformation {}
