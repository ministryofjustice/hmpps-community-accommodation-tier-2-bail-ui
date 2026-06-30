import { Cas2Application } from '@approved-premises/api'
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

  describe('isApplicable', () => {
    it('returns true for court bail applications', () => {
      const testApplication = { ...application, applicationOrigin: 'courtBail' } as Cas2Application
      expect(new SupervisedByProbation({}, testApplication).isApplicable()).toBe(true)
    })

    it('returns true for prison bail applications', () => {
      const testApplication = { ...application, applicationOrigin: 'prisonBail' } as Cas2Application
      expect(new SupervisedByProbation({}, testApplication).isApplicable()).toBe(true)
    })

    it('returns false for new cohort applications', () => {
      const testApplication = { ...application, applicationOrigin: 'other' } as Cas2Application
      expect(new SupervisedByProbation({}, testApplication).isApplicable()).toBe(false)
    })
  })
})
