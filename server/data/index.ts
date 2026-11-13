import applicationInfoSupplier from '../applicationInfo'
import HmppsAuthClient from './hmppsAuthClient'
import ApplicationClient from './applicationClient'
import AssessmentClient from './assessmentClient'
import SubmittedApplicationClient from './submittedApplicationClient'
import ReferenceDataClient from './referenceDataClient'
import ReportClient from './reportClient'
import UserClient from './userClient'
import PersonClient from './personClient'

const applicationInfo = applicationInfoSupplier()

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuthClient: new HmppsAuthClient(),
  personClient: ((token: string) => new PersonClient(token)) as RestClientBuilder<PersonClient>,
  applicationClient: ((token: string) => new ApplicationClient(token)) as RestClientBuilder<ApplicationClient>,
  assessmentClient: ((token: string) => new AssessmentClient(token)) as RestClientBuilder<AssessmentClient>,
  referenceDataClient: ((token: string) => new ReferenceDataClient(token)) as RestClientBuilder<ReferenceDataClient>,
  submittedApplicationClient: ((token: string) =>
    new SubmittedApplicationClient(token)) as RestClientBuilder<SubmittedApplicationClient>,
  reportClient: ((token: string) => new ReportClient(token)) as RestClientBuilder<ReportClient>,
  userClient: ((token: string) => new UserClient(token)) as RestClientBuilder<UserClient>,
})

export type DataAccess = ReturnType<typeof dataAccess>

export {
  HmppsAuthClient,
  type RestClientBuilder,
  PersonClient,
  ApplicationClient,
  AssessmentClient,
  SubmittedApplicationClient,
  ReferenceDataClient,
  UserClient,
}
