import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import BailHearingArranger from './bailHearingArranger'

describe('BailHearingArranger', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHavePreviousValue(new BailHearingArranger({}, application), 'taskList')
  itShouldHaveNextValue(new BailHearingArranger({ bailHearingArranger: 'applicant' }, application), 'bail-hearing-date')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new BailHearingArranger(
        {
          bailHearingArranger: 'applicant',
        },
        application,
      )

      expect(page.items()).toEqual([
        {
          value: 'solicitor',
          text: 'Solicitor',
          checked: false,
        },
        {
          value: 'applicant',
          text: 'Applicant',
          checked: true,
        },
      ])
    })
  })
})
