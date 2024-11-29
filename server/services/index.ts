import { dataAccess } from '../data'
import AuditService from './auditService'
import TaskListService from './taskListService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  return {
    applicationInfo,
    auditService,
  }
}

export type Services = ReturnType<typeof services>

export { TaskListService }
