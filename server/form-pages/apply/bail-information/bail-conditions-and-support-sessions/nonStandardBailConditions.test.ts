import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import NonStandardBailConditions, { NonStandardBailConditionsBody } from './nonStandardBailConditions'

describe('NonStandardBailConditions', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new NonStandardBailConditions({}, application)

      expect(page.title).toEqual('Are there any non-standard bail conditions being considered for Roger Smith?')
    })
  })

  itShouldHavePreviousValue(new NonStandardBailConditions({}, application), 'taskList')
  itShouldHaveNextValue(new NonStandardBailConditions({}, application), 'mandatory-support-sessions')

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
      ])
    })
  })

  describe('errors', () => {
    describe('when they have not provided any answer', () => {
      it('does not return an error', () => {
        const page = new NonStandardBailConditions({}, application)
        expect(page.errors()).toEqual({})
      })
    })
    describe('when they have not provided detail', () => {
      it('does not return an error', () => {
        const page = new NonStandardBailConditions({ nonStandardBailConditions: 'yes' }, application)
        expect(page.errors()).toEqual({})
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
