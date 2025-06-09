import { sectionsForUser, sections } from './userUtils'

jest.mock('../config')

describe('userUtils', () => {
  describe('sectionsForUser', () => {
    beforeEach(() => {
      const mockedConfig = jest.requireMock('../config').default
      mockedConfig.flags = { enablePrisonDashboard: 'false' }
    })

    it('should return an empty array for a user with no roles', () => {
      expect(sectionsForUser([])).toEqual([])
    })

    it('should return correct sections for an admin', () => {
      const expected = [sections.submittedApplications]
      expect(sectionsForUser(['CAS2_ADMIN'])).toEqual(expected)
    })

    it('should return correct sections for a management information user', () => {
      const expected = [sections.managementInformationReports]
      expect(sectionsForUser(['CAS2_MI'])).toEqual(expected)
    })

    describe('when the prison dashboard feature flag is disabled', () => {
      it('should return section for prison dashboard for CAS2 court bail referrer', () => {
        const mockedConfig = jest.requireMock('../config').default
        mockedConfig.flags = { enablePrisonDashboard: false }

        const expected = [sections.applications, sections.newApplication]
        expect(sectionsForUser(['CAS2_COURT_BAIL_REFERRER'])).toEqual(expected)
      })

      it('should return section for prison dashboard for CAS2 prison bail referrer', () => {
        const mockedConfig = jest.requireMock('../config').default
        mockedConfig.flags = { enablePrisonDashboard: false }

        const expected = [sections.applications, sections.newApplication]
        expect(sectionsForUser(['CAS2_PRISON_BAIL_REFERRER'])).toEqual(expected)
      })
    })

    describe('when the prison dashboard feature flag is enabled', () => {
      it('should not return section for prison dashboard for CAS2 court bail referrer', () => {
        const mockedConfig = jest.requireMock('../config').default
        mockedConfig.flags = { enablePrisonDashboard: true }

        const expected = [sections.applications, sections.newApplication]
        expect(sectionsForUser(['CAS2_COURT_BAIL_REFERRER'])).toEqual(expected)
      })

      it('should return section for prison dashboard for CAS2 prison bail referrer', () => {
        const mockedConfig = jest.requireMock('../config').default
        mockedConfig.flags = { enablePrisonDashboard: true }

        const expected = [sections.applications, sections.newApplication, sections.prisonApplications]
        expect(sectionsForUser(['CAS2_PRISON_BAIL_REFERRER'])).toEqual(expected)
      })
    })
  })
})
