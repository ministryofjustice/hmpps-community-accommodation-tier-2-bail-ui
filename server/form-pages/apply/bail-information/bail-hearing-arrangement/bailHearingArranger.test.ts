import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import BailHearingArranger from './bailHearingArranger'

describe('BailHearingArranger', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHavePreviousValue(new BailHearingArranger({}, application), 'taskList')

  describe('when legal advisor is selected', () => {
    itShouldHaveNextValue(
      new BailHearingArranger({ bailHearingArranger: 'legalAdvisor' }, application),
      'bail-hearing-contact',
    )
  })
  describe('when legal advisor is not selected', () => {
    itShouldHaveNextValue(new BailHearingArranger({ bailHearingArranger: 'applicant' }, application), '')
  })

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
          value: 'legalAdvisor',
          text: 'Legal Advisor (from the court)',
          checked: false,
        },
        {
          value: 'applicant',
          text: "Applicant with prison referrer's help",
          checked: true,
        },
      ])
    })
  })
})
