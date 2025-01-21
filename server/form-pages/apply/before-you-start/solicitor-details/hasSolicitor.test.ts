import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import HasSolicitor from './hasSolicitor'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'
import { getQuestions } from '../../../utils/questions'

describe('HasSolicitor', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  const questions = getQuestions('Roger Smith')

  describe('title', () => {
    it('personalises the page title', () => {
      const page = new HasSolicitor({ hasSolicitor: 'yes' }, application)

      expect(page.title).toEqual('Does Roger Smith have a solicitor?')
    })
  })

  describe('when the person does not have a solicitor', () => {
    itShouldHaveNextValue(new HasSolicitor({ hasSolicitor: 'no' }, application), '')
  })
  describe('when the person does have a solicitor', () => {
    itShouldHaveNextValue(new HasSolicitor({ hasSolicitor: 'yes' }, application), 'contact-information')
  })
  itShouldHavePreviousValue(new HasSolicitor({ hasSolicitor: 'yes' }, application), 'taskList')

  describe('items', () => {
    it('returns the radio with the expected label text', () => {
      const page = new HasSolicitor({ hasSolicitor: 'yes' }, application)

      expect(page.items()).toEqual([
        {
          value: 'yes',
          text: questions['solicitor-details']['has-solicitor'].hasSolicitor.answers.yes,
          checked: true,
        },
        {
          value: 'no',
          text: questions['solicitor-details']['has-solicitor'].hasSolicitor.answers.no,
          checked: false,
        },
      ])
    })
  })

  describe('errors', () => {
    it('should return errors when yes/no questions are blank', () => {
      const page = new HasSolicitor({}, application)

      expect(page.errors()).toEqual({
        hasSolicitor: 'Choose either Yes or No',
      })
    })
  })
})
