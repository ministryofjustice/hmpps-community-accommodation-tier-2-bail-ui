/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'
import PersonClient from './personClient'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'
import RedisTokenStore from './tokenStore/redisTokenStore'
import InMemoryTokenStore from './tokenStore/inMemoryTokenStore'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import ApplicationClient from './applicationClient'
import AssessmentClient from './assessmentClient'
import SubmittedApplicationClient from './submittedApplicationClient'
import ReferenceDataClient from './referenceDataClient'
import ReportClient from './reportClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuthClient: new HmppsAuthClient(
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  ),
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  personClient: ((token: string) => new PersonClient(token)) as RestClientBuilder<PersonClient>,
  applicationClient: ((token: string) => new ApplicationClient(token)) as RestClientBuilder<ApplicationClient>,
  assessmentClient: ((token: string) => new AssessmentClient(token)) as RestClientBuilder<AssessmentClient>,
  referenceDataClient: ((token: string) => new ReferenceDataClient(token)) as RestClientBuilder<ReferenceDataClient>,
  submittedApplicationClient: ((token: string) =>
    new SubmittedApplicationClient(token)) as RestClientBuilder<SubmittedApplicationClient>,
  reportClient: ((token: string) => new ReportClient(token)) as RestClientBuilder<ReportClient>,
})

export type DataAccess = ReturnType<typeof dataAccess>

export {
  HmppsAuthClient,
  RestClientBuilder,
  HmppsAuditClient,
  PersonClient,
  ApplicationClient,
  AssessmentClient,
  SubmittedApplicationClient,
  ReferenceDataClient,
}
