import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import HasFixedAddressBeforeCustody from './hasFixedAddressBeforeCustody'
import { getQuestions } from '../../../utils/questions'

describe('HasFixedAddressBeforeCustody', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const questions = getQuestions('Roger Smith')

  describe('title', () => {
    it.each(['prisonBail', 'courtBail', 'hdc', 'hcrd', 'hefr', 'rarr'] as const)(
      'asks about the address before custody for the custodial cohort %s',
      cohort => {
        const page = new HasFixedAddressBeforeCustody({}, { ...application, cohort })

        expect(page.title).toEqual('Did Roger Smith have a fixed address before entering custody?')
      },
    )

    it.each(['isc', 'atcr', 'from_ap'] as const)(
      'asks about the current address for the non-custodial cohort %s',
      cohort => {
        const page = new HasFixedAddressBeforeCustody({}, { ...application, cohort })

        expect(page.title).toEqual('Does Roger Smith have a fixed address?')
      },
    )
  })

  describe('Routing', () => {
    describe('when the person had a fixed address', () => {
      itShouldHaveNextValue(
        new HasFixedAddressBeforeCustody({ hasFixedAddressBeforeCustody: 'yes' }, application),
        'last-fixed-address',
      )
    })

    describe('when the person did not have a fixed address', () => {
      itShouldHaveNextValue(
        new HasFixedAddressBeforeCustody({ hasFixedAddressBeforeCustody: 'no' }, application),
        'no-fixed-address',
      )
    })

    itShouldHavePreviousValue(new HasFixedAddressBeforeCustody({}, application), 'taskList')
  })

  describe('errors', () => {
    it('returns an error when hasFixedAddressBeforeCustody is not answered', () => {
      const page = new HasFixedAddressBeforeCustody({}, application)

      expect(page.errors()).toEqual({
        hasFixedAddressBeforeCustody: 'Select yes if the applicant had a fixed address before entering custody',
      })
    })

    it('returns no errors when hasFixedAddressBeforeCustody is answered', () => {
      const page = new HasFixedAddressBeforeCustody({ hasFixedAddressBeforeCustody: 'yes' }, application)

      expect(page.errors()).toEqual({})
    })
  })

  describe('response', () => {
    it('uses the custodial question wording on the check your answers page', () => {
      const page = new HasFixedAddressBeforeCustody(
        { hasFixedAddressBeforeCustody: 'yes' },
        { ...application, cohort: 'courtBail' },
      )

      expect(page.response()).toEqual({
        'Did Roger Smith have a fixed address before entering custody?': 'Yes',
      })
    })

    it('uses the non-custodial question wording on the check your answers page', () => {
      const page = new HasFixedAddressBeforeCustody(
        { hasFixedAddressBeforeCustody: 'no' },
        { ...application, cohort: 'isc' },
      )

      expect(page.response()).toEqual({
        'Does Roger Smith have a fixed address?': 'No',
      })
    })
  })

  describe('items', () => {
    it('returns the radio items with the correct checked state', () => {
      const page = new HasFixedAddressBeforeCustody({ hasFixedAddressBeforeCustody: 'yes' }, application)

      expect(page.items()).toEqual([
        {
          value: 'yes',
          text: questions['address-history']['has-fixed-address-before-custody'].hasFixedAddressBeforeCustody.answers
            .yes,
          checked: true,
        },
        {
          value: 'no',
          text: questions['address-history']['has-fixed-address-before-custody'].hasFixedAddressBeforeCustody.answers
            .no,
          checked: false,
        },
      ])
    })
  })
})
