/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import WorkingMobilePhone from './workingMobilePhone'
import ImmigrationStatus from './immigrationStatus'
import PregnancyInformation from './pregnancyInformation'
import SupportWorkerPreference from './supportWorkerPreference'
import Gender from './gender'
import CustodyLocation from './custodyLocation'

@Task({
  name: 'Add personal information',
  slug: 'personal-information',
  pages: [
    CustodyLocation,
    WorkingMobilePhone,
    ImmigrationStatus,
    Gender,
    PregnancyInformation,
    SupportWorkerPreference,
  ],
})
export default class PersonalInformation {}
