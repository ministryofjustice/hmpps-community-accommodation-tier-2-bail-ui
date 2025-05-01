import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import NonStandardBailConditions, { NonStandardBailConditionsBody } from './nonStandardBailConditions'

describe('NonStandardBailConditions', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new NonStandardBailConditions({}, application)

      expect(page.title).toEqual('Are there any non-standard bail conditions being considered?')
    })
  })

  itShouldHavePreviousValue(new NonStandardBailConditions({}, application), 'taskList')
  itShouldHaveNextValue(new NonStandardBailConditions({}, application), '')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new NonStandardBailConditions(
        {
          nonStandardBailConditions: 'no',
        },
        application,
      )

      expect(page.items('some html')).toEqual([
        {
          value: 'yes',
          text: 'Yes',
          checked: false,
          conditional: { html: 'some html' },
        },
        {
          value: 'no',
          text: 'No',
          checked: true,
        },
        {
          value: 'dontKnow',
          text: 'I do not know',
          checked: false,
        },
      ])
    })
  })

  describe('errors', () => {
    describe('when they have not provided any answer', () => {
      it('returns an error for nonStandardBailConditions', () => {
        const page = new NonStandardBailConditions({}, application)
        expect(page.errors()).toEqual({
          nonStandardBailConditions: "Select if there are any non-standard bail conditions, or select 'I do not know'",
        })
      })
    })
    describe('when they have not provided detail', () => {
      it('returns an error', () => {
        const page = new NonStandardBailConditions({ nonStandardBailConditions: 'yes' }, application)
        expect(page.errors()).toEqual({ nonStandardBailConditionsDetail: 'Enter the non-standard bail conditions' })
      })
    })
  })

  describe('onSave', () => {
    it('removes non-standard bail conditions data when the question is not set to "yes"', () => {
      const body: NonStandardBailConditionsBody = {
        nonStandardBailConditions: 'no',
        nonStandardBailConditionsDetail: 'Non-standard bail condition detail',
      }

      const page = new NonStandardBailConditions(body, application)

      page.onSave()

      expect(page.body).toEqual({
        nonStandardBailConditions: 'no',
      })
    })
  })
})
