import { faker } from '@faker-js/faker/locale/en_GB'
import { Cas2OASysRiskLevel, Cas2OAsysRoshRatingsDto } from '@approved-premises/api'
import { Factory } from 'fishery'
import { DateFormats } from '../../utils/dateUtils'

const riskLevels: Array<Cas2OASysRiskLevel> = ['very_high', 'high', 'medium', 'low']

export default Factory.define<Cas2OAsysRoshRatingsDto>(() => ({
  overallRisk: faker.helpers.arrayElement(riskLevels),
  riskToChildren: faker.helpers.arrayElement(riskLevels),
  riskToPublic: faker.helpers.arrayElement(riskLevels),
  riskToKnownAdult: faker.helpers.arrayElement(riskLevels),
  riskToStaff: faker.helpers.arrayElement(riskLevels),
  metadata: {
    dateCompleted: DateFormats.dateObjToIsoDate(faker.date.recent({ days: 180 })),
    dateStarted: DateFormats.dateObjToIsoDate(faker.date.recent({ days: 180 })),
    hasApplicableAssessment: faker.helpers.arrayElement([true, false]),
  },
}))
