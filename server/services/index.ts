import { dataAccess } from '../data'
import UserService from './userService'
import PersonService from './personService'
import ApplicationService from './applicationService'
import AssessmentService from './assessmentService'
import SubmittedApplicationService from './submittedApplicationService'
import TaskListService from './taskListService'
import ReportService from './reportService'

export const services = () => {
  const {
    applicationInfo,
    hmppsAuthClient,
    personClient,
    applicationClient,
    assessmentClient,
    submittedApplicationClient,
    referenceDataClient,
    reportClient,
  } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const personService = new PersonService(personClient)
  const applicationService = new ApplicationService(applicationClient)
  const assessmentService = new AssessmentService(assessmentClient)
  const submittedApplicationService = new SubmittedApplicationService(submittedApplicationClient, referenceDataClient)
  const reportService = new ReportService(reportClient)

  return {
    applicationInfo,
    userService,
    personService,
    applicationService,
    assessmentService,
    submittedApplicationService,
    reportService,
  }
}

export type Services = ReturnType<typeof services>

export {
  UserService,
  PersonService,
  ApplicationService,
  AssessmentService,
  SubmittedApplicationService,
  TaskListService,
}
