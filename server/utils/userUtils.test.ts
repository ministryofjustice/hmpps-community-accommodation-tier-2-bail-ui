import { sectionsForUser, sections } from './userUtils'

describe('userUtils', () => {
  describe('sectionsForUser', () => {
    it('should return an empty array for a user with no roles', () => {
      expect(sectionsForUser([])).toEqual([])
    })

    it('should return correct sections for a CAS2 prison bail referrer', () => {
      const expected = [sections.applications, sections.newApplication]
      expect(sectionsForUser(['CAS2_PRISON_BAIL_REFERRER'])).toEqual(expected)
    })

    it('should return correct sections for a CAS2 court bail referrer', () => {
      const expected = [sections.applications, sections.newApplication]
      expect(sectionsForUser(['CAS2_COURT_BAIL_REFERRER'])).toEqual(expected)
    })

    it('should return correct sections for an admin', () => {
      const expected = [sections.submittedApplications]
      expect(sectionsForUser(['CAS2_ADMIN'])).toEqual(expected)
    })

    it('should return correct sections for a management information user', () => {
      const expected = [sections.managementInformationReports]
      expect(sectionsForUser(['CAS2_MI'])).toEqual(expected)
    })
  })
})
