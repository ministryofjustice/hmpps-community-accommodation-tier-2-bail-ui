import { sectionsForUser, sections } from './userUtils'

describe('userUtils', () => {
  describe('sectionsForUser', () => {
    it('should return an empty array for a user with no roles', () => {
      expect(sectionsForUser([])).toEqual([])
    })

    it('should return correct sections for a POM', () => {
      const expected = [sections.applications, sections.newApplication]
      expect(sectionsForUser(['POM'])).toEqual(expected)
    })

    it('should return correct sections for a Licence CA', () => {
      const expected = [sections.applications, sections.newApplication]
      expect(sectionsForUser(['LICENCE_CA'])).toEqual(expected)
    })

    it('should return correct sections for a probation user', () => {
      const expected = [sections.applications, sections.newApplication]
      expect(sectionsForUser(['PROBATION'])).toEqual(expected)
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
