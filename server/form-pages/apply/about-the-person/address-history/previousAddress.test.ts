import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import PreviousAddress from './previousAddress'

describe('PreviousAddress', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('has a page title', () => {
      const page = new PreviousAddress({}, application)

      expect(page.title).toEqual('Did Roger Smith have a fixed address before being arrested?')
    })
  })

  itShouldHaveNextValue(new PreviousAddress({}, application), '')
  itShouldHavePreviousValue(new PreviousAddress({}, application), 'taskList')

  describe('errors', () => {
    describe('when the previous address question has not been answered', () => {
      it('returns an error', () => {
        const page = new PreviousAddress({}, application)
        const errors = page.errors()

        expect(errors.hasPreviousAddress).toEqual('Select yes if the applicant had a fixed address before being held')
      })
    })

    describe('when the latestLivingSituation question has not been answered', () => {
      it('returns an error', () => {
        const page = new PreviousAddress({}, application)
        const errors = page.errors()

        expect(errors.latestLivingSituation).toEqual('Select their living situation')
      })
    })

    describe('when hasPreviousAddress is _YES_', () => {
      describe('when previousAddress is empty', () => {
        it('returns an error', () => {
          const page = new PreviousAddress({ hasPreviousAddress: 'yes' }, application)
          const errors = page.errors()

          expect(errors.previousAddress).toEqual('Enter their last fixed address')
        })
      })
    })

    describe('when hasPreviousAddress is _NO_', () => {
      describe('when howLong is empty', () => {
        it('returns an error', () => {
          const page = new PreviousAddress({ hasPreviousAddress: 'no' }, application)
          const errors = page.errors()

          expect(errors.howLong).toEqual('Enter how long they have had no fixed address for')
        })
      })
    })

    describe('when latestLivingSituation is _OTHER_', () => {
      describe('when otherLivingSituation is empty', () => {
        it('returns an error', () => {
          const page = new PreviousAddress({ latestLivingSituation: 'other' }, application)
          const errors = page.errors()

          expect(errors.otherLivingSituation).toEqual('Enter details of other living situation')
        })
      })
    })
  })

  describe('addressItems', () => {
    it('returns the radio buttons as expected', () => {
      const page = new PreviousAddress({}, application)

      const knownAddressHtml = 'known address'
      const lastKnownHtml = 'last known'

      expect(page.addressItems(knownAddressHtml, lastKnownHtml)).toEqual([
        { value: 'yes', text: 'Yes', checked: false, conditional: { html: knownAddressHtml } },
        { value: 'no', text: 'No', checked: false, conditional: { html: lastKnownHtml } },
      ])
    })
  })

  describe('latestLivingSituationItems', () => {
    it('returns the radio buttons as expected', () => {
      const page = new PreviousAddress({ latestLivingSituation: 'homeless' }, application)

      const otherLivingSituationHtml = 'other living situation'

      expect(page.latestLivingSituationItems(otherLivingSituationHtml)).toEqual([
        {
          checked: false,
          text: 'Living on their own in a rented or owned property (house, flat, trainler, etc)',
          value: 'rentalOrOwnedAlone',
        },
        {
          checked: false,
          text: 'Living in a rented or owned property with other people',
          value: 'rentalOrOwnedWithOthers',
        },
        {
          checked: false,
          text: 'Living in supported accommodation',
          value: 'supportedAccommodation',
        },
        {
          checked: false,
          text: 'Living in shared accommodation',
          value: 'sharedAccommodation',
        },
        {
          checked: false,
          text: 'Living with a relative or friend',
          value: 'withRelativeOrFriend',
        },
        {
          checked: false,
          text: 'Living in temporary accommodation',
          value: 'temporaryAccommodation',
        },
        {
          checked: true,
          text: 'Homeless',
          value: 'homeless',
        },
        {
          divider: 'or',
        },
        {
          checked: false,
          conditional: {
            html: 'other living situation',
          },
          text: 'Other',
          value: 'other',
        },
      ])
    })
  })

  describe('onSave', () => {
    describe('when hasPreviousAddress is set to _YES_', () => {
      it('removes data relating to the last know address', () => {
        const page = new PreviousAddress(
          { hasPreviousAddress: 'yes', lastKnownAddress: '123 last address street', howLong: 'very long' },
          application,
        )
        page.onSave()

        expect(page.body).toEqual({
          hasPreviousAddress: 'yes',
        })
      })
    })

    describe('when hasPreviousAddress is set to _NO_', () => {
      it('removes data relating to the last know address', () => {
        const page = new PreviousAddress(
          { hasPreviousAddress: 'no', previousAddress: '456 previous address street' },
          application,
        )
        page.onSave()

        expect(page.body).toEqual({
          hasPreviousAddress: 'no',
        })
      })
    })

    describe('when latestLivingSituation is not set to _OTHER_', () => {
      it('removes data relating to the other living situation', () => {
        const page = new PreviousAddress(
          { latestLivingSituation: 'withRelativeOrFriend', otherLivingSituation: 'an unusual living situation' },
          application,
        )
        page.onSave()

        expect(page.body).toEqual({
          latestLivingSituation: 'withRelativeOrFriend',
        })
      })
    })
  })
})
