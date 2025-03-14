import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import SafetyOfStaff, { SafetyOfStaffBody } from './safetyOfStaff'

describe('SafetyOfStaff', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('adds the page title', () => {
      const page = new SafetyOfStaff({}, application)

      expect(page.title).toEqual('Concerns related to the safety of staff')
    })
  })

  itShouldHaveNextValue(new SafetyOfStaff({}, application), 'additional-concerns')
  itShouldHavePreviousValue(new SafetyOfStaff({}, application), 'living-in-the-community')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new SafetyOfStaff({}, application)

      it('includes a validation error for _pastRiskToStaff_', () => {
        expect(page.errors()).toHaveProperty(
          'pastRiskToStaff',
          `Select if they have posed a risk to the safety of any staff`,
        )
      })

      it('includes a validation error for _currentConcerns_', () => {
        expect(page.errors()).toHaveProperty(
          'currentConcerns',
          `Select if there are any current concerns over the safety of any staff`,
        )
      })
    })

    describe('when _pastRiskToStaff_ is YES', () => {
      const page = new SafetyOfStaff({ pastRiskToStaff: 'yes' }, application)

      describe('and _pastRiskToStaffDetail_ is UNANSWERED', () => {
        it('includes a validation error for _pastRiskToStaffDetail_', () => {
          expect(page.errors()).toHaveProperty('pastRiskToStaffDetail', 'Enter details of the incidents')
        })
      })
    })

    describe('when _currentConcerns_ is YES', () => {
      const page = new SafetyOfStaff({ currentConcerns: 'yes' }, application)

      describe('and _currentConcernsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _currentConcernsDetail_', () => {
          expect(page.errors()).toHaveProperty('currentConcernsDetail', 'Enter details of current concerns')
        })
      })
    })
  })

  describe('onSave', () => {
    describe('when _pastRiskToStaff_ is NO', () => {
      it('removes pastRiskToStaffDetail answer', () => {
        const body: Partial<SafetyOfStaffBody> = {
          pastRiskToStaff: 'no',
          pastRiskToStaffDetail: 'some details',
        }

        const page = new SafetyOfStaff(body, application)

        page.onSave()

        expect(page.body).toEqual({
          pastRiskToStaff: 'no',
        })
      })
    })

    describe('when _currentConcerns_ is NO', () => {
      it('removes currentConcernsDetail answer', () => {
        const body: Partial<SafetyOfStaffBody> = {
          currentConcerns: 'no',
          currentConcernsDetail: 'some details',
        }

        const page = new SafetyOfStaff(body, application)

        page.onSave()

        expect(page.body).toEqual({
          currentConcerns: 'no',
        })
      })
    })
  })
})
