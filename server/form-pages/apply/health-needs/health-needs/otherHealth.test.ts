import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import OtherHealth, { OtherHealthBody } from './otherHealth'

describe('OtherHealth', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHaveNextValue(new OtherHealth({}, application), 'information-sources')
  itShouldHavePreviousValue(new OtherHealth({}, application), 'brain-injury')

  describe('errors', () => {
    describe('when top-level questions are unanswered', () => {
      const page = new OtherHealth({}, application)

      it('includes a validation error for _hasOtherHealthNeeds_', () => {
        expect(page.errors()).toHaveProperty('hasOtherHealthNeeds', 'Select yes if they have other health needs')
      })
    })

    describe('when _hasOtherHealthNeeds_ is YES', () => {
      const page = new OtherHealth({ hasOtherHealthNeeds: 'yes' }, application)

      describe('and _healthNeedsDetail_ is UNANSWERED', () => {
        it('includes a validation error for _healthNeedsDetail_', () => {
          expect(page.errors()).toHaveProperty('healthNeedsDetail', 'Enter the details of their needs')
        })
      })
    })
  })

  describe('onSave', () => {
    it('removes other health condition data when the question is set to "no"', () => {
      const body: Partial<OtherHealthBody> = {
        hasOtherHealthNeeds: 'no',
        healthNeedsDetail: 'Health needs detail',
      }

      const page = new OtherHealth(body, application)

      page.onSave()

      expect(page.body).toEqual({
        hasOtherHealthNeeds: 'no',
      })
    })
  })
})
