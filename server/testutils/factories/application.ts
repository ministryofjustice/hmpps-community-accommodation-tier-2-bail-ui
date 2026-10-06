import { faker } from '@faker-js/faker/locale/en_GB'
import { Factory } from 'fishery'
import { ApplicationOrigin, Cas2Application as Application, Cas2CohortDto } from '@approved-premises/api'
import { DateFormats } from '../../utils/dateUtils'
import { fullPersonFactory } from './person'
import cas2v2UserFactory from './cas2v2User'
import { newCohortLabels } from '../../utils/applications/cohortLabels'

class ApplicationFactory extends Factory<Application> {
  newCohort(cohort?: Cas2CohortDto) {
    return this.params({
      applicationOrigin: 'other',
      cohort: cohort || (faker.helpers.arrayElement(Object.keys(newCohortLabels)) as Cas2CohortDto),
      data: {
        'cohort-selection': {
          'cohort-selection': { cohort },
        },
      },
    })
  }
}

export default ApplicationFactory.define(() => ({
  id: faker.string.uuid(),
  applicationOrigin: 'prisonBail' as ApplicationOrigin,
  cohort: 'prisonBail' as Cas2CohortDto,
  person: fullPersonFactory.build(),
  createdBy: cas2v2UserFactory.build({}),
  createdAt: DateFormats.dateObjToIsoDateTime(faker.date.past()),
  submittedAt: undefined as string,
  data: {},
  document: {},
  status: 'inProgress' as const,
  type: 'CAS2V2',
  telephoneNumber: undefined as string,
}))
