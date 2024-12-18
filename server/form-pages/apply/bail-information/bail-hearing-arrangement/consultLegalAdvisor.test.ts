import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import ConsultLegalAdvisor from './consultLegalAdvisor'

describe('ConsultLegalAdvisor', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHavePreviousValue(new ConsultLegalAdvisor({}, application), 'bail-hearing-contact')
  itShouldHaveNextValue(new ConsultLegalAdvisor({}, application), '')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new ConsultLegalAdvisor(
        {
          consultLegalAdvisor: 'yes',
        },
        application,
      )

      expect(page.items()).toEqual([
        {
          value: 'yes',
          text: 'Yes',
          checked: true,
        },
        {
          value: 'no',
          text: 'No',
          checked: false,
        },
      ])
    })
  })
})
