import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import SupervisedByProbation from './supervisedByProbation'

describe('Community supervision', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('when the applicant is under probation supervision', () => {
    itShouldHaveNextValue(
      new SupervisedByProbation({ probationSupervision: 'yes' }, application),
      'community-probation-practitioner-details',
    )
  })

  describe('when the applicant is not under probation supervision', () => {
    itShouldHaveNextValue(new SupervisedByProbation({ probationSupervision: 'no' }, application), '')
  })

  itShouldHavePreviousValue(new SupervisedByProbation({}, application), 'taskList')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new SupervisedByProbation({ probationSupervision: 'yes' }, application)
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
      const page = new SupervisedByProbation({}, application)

      expect(page.errors()).toEqual({
        probationSupervision: 'Confirm whether the applicant is currently supervised by probation',
      })
    })
  })
})
