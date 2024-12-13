import { itShouldHavePreviousValue, itShouldHaveNextValue } from '../../../shared-examples'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'
import MandatorySupportSessions, { MandatorySupportSessionsBody } from './mandatorySupportSessions'

describe('MandatorySupportSessions', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new MandatorySupportSessions({}, application)

      expect(page.title).toEqual(
        'Does the court require more than one mandatory support session per week for Roger Smith?',
      )
    })
  })

  itShouldHavePreviousValue(new MandatorySupportSessions({}, application), 'non-standard-bail-conditions')
  itShouldHaveNextValue(new MandatorySupportSessions({}, application), '')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new MandatorySupportSessions(
        {
          mandatorySupportSessions: 'no',
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
        const page = new MandatorySupportSessions({}, application)
        expect(page.errors()).toEqual({})
      })
    })
    describe('when they have not provided detail', () => {
      it('does not return an error', () => {
        const page = new MandatorySupportSessions({ mandatorySupportSessions: 'yes' }, application)
        expect(page.errors()).toEqual({})
      })
    })
  })

  describe('onSave', () => {
    it('removes non-standard bail conditions data when the question is not set to "yes"', () => {
      const body: MandatorySupportSessionsBody = {
        mandatorySupportSessions: 'no',
        mandatorySupportSessionsDetail: 'Non-standard bail condition detail',
      }

      const page = new MandatorySupportSessions(body, application)

      page.onSave()

      expect(page.body).toEqual({
        mandatorySupportSessions: 'no',
      })
    })
  })
})
