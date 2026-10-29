import { dataAccess } from '../data'
import UserService from './userService'
import PersonService from './personService'
import ApplicationService from './applicationService'
import AssessmentService from './assessmentService'
import SubmittedApplicationService from './submittedApplicationService'
import TaskListService from './taskListService'
import ReportService from './reportService'
import FormDataService from './formDataService'

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
    userClient,
    formDataClient,
  } = dataAccess()

  const userService = new UserService(hmppsAuthClient, userClient)
  const personService = new PersonService(personClient)
  const applicationService = new ApplicationService(applicationClient)
  const assessmentService = new AssessmentService(assessmentClient)
  const submittedApplicationService = new SubmittedApplicationService(submittedApplicationClient, referenceDataClient)
  const reportService = new ReportService(reportClient)
  const formDataService = new FormDataService(formDataClient)

  return {
    applicationInfo,
    userService,
    personService,
    applicationService,
    assessmentService,
    submittedApplicationService,
    reportService,
    formDataService,
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
  FormDataService,
}
