import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import CommunitySupervision from './communitySupervision'

describe('Community supervision', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('when the applicant is under probation supervision', () => {
    itShouldHaveNextValue(new CommunitySupervision({ probationSupervision: 'yes' }, application), 'cpp-details')
  })

  describe('when the applicant is not under probation supervision', () => {
    itShouldHaveNextValue(new CommunitySupervision({ probationSupervision: 'no' }, application), '')
  })

  itShouldHavePreviousValue(new CommunitySupervision({}, application), 'taskList')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new CommunitySupervision({ probationSupervision: 'yes' }, application)
      expect(page.items()).toEqual([
        {
          checked: true,
          text: 'Yes',
          value: 'yes',
        },
        {
          checked: false,
          text: 'No',
          value: 'no',
        },
      ])
    })
  })

  describe('errors', () => {
    it('should return errors when the questions are blank', () => {
      const page = new CommunitySupervision({}, application)

      expect(page.errors()).toEqual({
        probationSupervision: 'Confirm whether the applicant is currently supervised by probation',
      })
    })
  })
})
