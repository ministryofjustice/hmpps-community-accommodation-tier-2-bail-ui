import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import HasFixedAddress from './hasFixedAddress'
import { getQuestions } from '../../../utils/questions'

describe('HasFixedAddress', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const questions = getQuestions('Roger Smith')

  describe('title', () => {
    it.each(['prisonBail', 'courtBail', 'hdc', 'hcrd', 'hefr', 'rarr'] as const)(
      'asks about the address before custody for the custodial cohort %s',
      cohort => {
        const page = new HasFixedAddress({}, { ...application, cohort })

        expect(page.title).toEqual('Did Roger Smith have a fixed address before entering custody?')
      },
    )

    it.each(['isc', 'atcr', 'from_ap'] as const)(
      'asks about the current address for the non-custodial cohort %s',
      cohort => {
        const page = new HasFixedAddress({}, { ...application, cohort })

        expect(page.title).toEqual('Does Roger Smith have a fixed address?')
      },
    )
  })

  describe('Routing', () => {
    describe('when the person had a fixed address', () => {
      itShouldHaveNextValue(new HasFixedAddress({ hasFixedAddress: 'yes' }, application), 'last-fixed-address')
    })

    describe('when the person did not have a fixed address', () => {
      itShouldHaveNextValue(new HasFixedAddress({ hasFixedAddress: 'no' }, application), 'no-fixed-address')
    })

    itShouldHavePreviousValue(new HasFixedAddress({}, application), 'taskList')
  })

  describe('errors', () => {
    it('returns an error when hasFixedAddress is not answered', () => {
      const page = new HasFixedAddress({}, application)

      expect(page.errors()).toEqual({
        hasFixedAddress: 'Select yes if the applicant had a fixed address before entering custody',
      })
    })

    it('returns an error matching the question wording for a non-custodial cohort', () => {
      const page = new HasFixedAddress({}, { ...application, cohort: 'isc' })

      expect(page.errors()).toEqual({
        hasFixedAddress: 'Select yes if the applicant has a fixed address',
      })
    })

    it('returns no errors when hasFixedAddress is answered', () => {
      const page = new HasFixedAddress({ hasFixedAddress: 'yes' }, application)

      expect(page.errors()).toEqual({})
    })
  })

  describe('response', () => {
    it('uses the custodial question wording on the check your answers page', () => {
      const page = new HasFixedAddress({ hasFixedAddress: 'yes' }, { ...application, cohort: 'courtBail' })

      expect(page.response()).toEqual({
        'Did Roger Smith have a fixed address before entering custody?': 'Yes',
      })
    })

    it('uses the non-custodial question wording on the check your answers page', () => {
      const page = new HasFixedAddress({ hasFixedAddress: 'no' }, { ...application, cohort: 'isc' })

      expect(page.response()).toEqual({
        'Does Roger Smith have a fixed address?': 'No',
      })
    })
  })

  describe('items', () => {
    it('returns the radio items with the correct checked state', () => {
      const page = new HasFixedAddress({ hasFixedAddress: 'yes' }, application)

      expect(page.items()).toEqual([
        {
          value: 'yes',
          text: questions['address-history']['has-fixed-address'].hasFixedAddress.answers.yes,
          checked: true,
        },
        {
          value: 'no',
          text: questions['address-history']['has-fixed-address'].hasFixedAddress.answers.no,
          checked: false,
        },
      ])
    })
  })
})
