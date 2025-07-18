import { SubmitCas2v2Application, UpdateApplication, ApplicationOrigin } from '@approved-premises/api'
import ApplicationClient from './applicationClient'
import { applicationFactory, applicationSummaryFactory } from '../testutils/factories'
import paths from '../paths/api'
import describeClient from '../testutils/describeClient'

describeClient('ApplicationClient', provider => {
  let applicationClient: ApplicationClient

  const token = 'token-1'

  beforeEach(() => {
    applicationClient = new ApplicationClient(token)
  })

  describe('find', () => {
    it('should return an application', async () => {
      const application = applicationFactory.build()

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request for an application',
        withRequest: {
          method: 'GET',
          path: paths.applications.show({ id: application.id }),
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: application,
        },
      })

      const result = await applicationClient.find(application.id)

      expect(result).toEqual(application)
    })
  })

  describe('create', () => {
    it('should return an application when a crn is posted', async () => {
      const application = applicationFactory.build()
      const applicationOrigin: ApplicationOrigin = 'courtBail'

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request to create an Application with risks',
        withRequest: {
          method: 'POST',
          path: paths.applications.new.pattern,
          body: {
            crn: application.person.crn,
            applicationOrigin,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 201,
          body: application,
        },
      })

      const result = await applicationClient.create(application.person.crn, applicationOrigin)

      expect(result).toEqual(application)
    })
  })

  describe('all', () => {
    it('should get all previous applications', async () => {
      const previousApplications = applicationSummaryFactory.buildList(5)

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request for all applications',
        withRequest: {
          method: 'GET',
          path: paths.applications.index.pattern,
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: previousApplications,
        },
      })

      const result = await applicationClient.all()

      expect(result).toEqual(previousApplications)
    })
  })

  describe('getAllByPrison', () => {
    it('should get all applications for a given prison', async () => {
      const applications = applicationSummaryFactory.buildList(5)

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request for all applications for a given prison',
        withRequest: {
          method: 'GET',
          path: paths.applications.index.pattern,
          query: {
            prisonCode: '123',
            isSubmitted: 'true',
            page: '1',
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: applications,
          headers: {
            'X-Pagination-TotalPages': '10',
            'X-Pagination-TotalResults': '100',
            'X-Pagination-PageSize': '10',
          },
        },
      })

      const result = await applicationClient.getAllByPrison('123', 1)

      expect(result).toEqual({
        data: applications,
        pageNumber: '1',
        totalPages: '10',
        totalResults: '100',
        pageSize: '10',
      })
    })
  })

  describe('getAllByOrigin', () => {
    it('should get all applications for a given applicationOrigin', async () => {
      const applications = applicationSummaryFactory.buildList(5)

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request for all applications for a given prison',
        withRequest: {
          method: 'GET',
          path: paths.applications.index.pattern,
          query: {
            isSubmitted: 'true',
            applicationOrigin: 'prisonBail',
            limitByUser: 'false',
            page: '1',
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: applications,
          headers: {
            'X-Pagination-TotalPages': '10',
            'X-Pagination-TotalResults': '100',
            'X-Pagination-PageSize': '10',
          },
        },
      })

      const result = await applicationClient.getAllByOrigin('prisonBail', 1)

      expect(result).toEqual({
        data: applications,
        pageNumber: '1',
        totalPages: '10',
        totalResults: '100',
        pageSize: '10',
      })
    })
  })

  describe('update', () => {
    it('should return an application when a PUT request is made', async () => {
      const application = applicationFactory.build()
      const data = {
        data: application.data,
        type: 'CAS2V2',
      } as UpdateApplication

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'Request to update an application',
        withRequest: {
          method: 'PUT',
          path: paths.applications.update({ id: application.id }),
          body: JSON.stringify(data),
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
          body: application,
        },
      })

      const result = await applicationClient.update(application.id, data)

      expect(result).toEqual(application)
    })
  })

  describe('submit', () => {
    it('should submit an application', async () => {
      const application = applicationFactory.build()
      const data = {
        translatedDocument: application.document,
        applicationId: application.id,
        telephoneNumber: '123',
        applicationOrigin: 'courtBail',
      } as SubmitCas2v2Application

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'A request to submit an application',
        withRequest: {
          method: 'POST',
          path: paths.submissions.create.pattern,
          body: data,
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
        },
      })

      await applicationClient.submit(application.id, data)
    })
  })

  describe('abandon', () => {
    it('should return response when a PUT request is made', async () => {
      const application = applicationFactory.build()

      await provider.addInteraction({
        state: 'Server is healthy',
        uponReceiving: 'Request to abandon an application',
        withRequest: {
          method: 'PUT',
          path: paths.applications.abandon({ id: application.id }),
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
        willRespondWith: {
          status: 200,
        },
      })

      await applicationClient.abandon(application.id)
    })
  })
})
