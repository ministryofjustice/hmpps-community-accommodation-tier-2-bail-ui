import { sectionsForUser, sections } from './userUtils'

describe('userUtils', () => {
  describe('sectionsForUser', () => {
    it('should return correct sections for a POM', () => {
      const expected = [sections.applications, sections.newApplication, sections.prisonDashboard]
      expect(sectionsForUser()).toEqual(expected)
    })
  })
})