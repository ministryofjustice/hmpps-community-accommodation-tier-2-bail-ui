import { faker } from '@faker-js/faker/locale/en_GB'
import { Cas2OAsysRoshSummaryDto } from '@approved-premises/api'
import { Factory } from 'fishery'
import { DateFormats } from '../../utils/dateUtils'

export default Factory.define<Cas2OAsysRoshSummaryDto>(() => ({
  whoIsAtRisk: faker.lorem.paragraph(),
  natureOfRisk: faker.lorem.paragraph(),
  metadata: {
    dateCompleted: DateFormats.dateObjToIsoDate(faker.date.recent({ days: 180 })),
    dateStarted: DateFormats.dateObjToIsoDate(faker.date.recent({ days: 180 })),
    hasApplicableAssessment: faker.helpers.arrayElement([true, false]),
  },
}))
