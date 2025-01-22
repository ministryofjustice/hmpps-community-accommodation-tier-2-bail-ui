import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import ConsultSolicitor from './consultSolicitor'

describe('ConsultSolicitor', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHavePreviousValue(new ConsultSolicitor({}, application), 'contact-information')
  itShouldHaveNextValue(new ConsultSolicitor({}, application), '')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new ConsultSolicitor(
        {
          consultSolicitor: 'yes',
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
