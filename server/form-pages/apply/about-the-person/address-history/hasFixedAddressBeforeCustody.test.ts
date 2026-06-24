import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import HasFixedAddressBeforeCustody from './hasFixedAddressBeforeCustody'
import { getQuestions } from '../../../utils/questions'

describe('HasFixedAddressBeforeCustody', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const questions = getQuestions('Roger Smith')

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new HasFixedAddressBeforeCustody({}, application)

      expect(page.title).toEqual('Did Roger Smith have a fixed address before entering custody?')
    })
  })

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
