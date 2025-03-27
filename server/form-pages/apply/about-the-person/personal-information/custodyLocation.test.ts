import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import CustodyLocation, { CustodyLocationBody } from './custodyLocation'
import { personFactory, applicationFactory } from '../../../../testutils/factories/index'

describe('CustodyLocation', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Sue Smith' }) })

  const body: CustodyLocationBody = {
    custodyLocation: 'British',
  }

  it('sets the question as the page title', () => {
    const page = new CustodyLocation(body, application)

    expect(page.title).toEqual('Where is Sue Smith being held in custody?')
  })

  it('sets the body', () => {
    const page = new CustodyLocation(body, application)

    expect(page.body).toEqual(body)
  })

  describe('errors', () => {
    it('returns an error if CustodyLocation is not selected', () => {
      const page = new CustodyLocation({ custodyLocation: '' }, application)

      expect(page.errors()).toEqual({
        custodyLocation: 'Enter where the applicant is being held in custody',
      })
    })
  })

  itShouldHaveNextValue(new CustodyLocation(body, application), 'working-mobile-phone')
  itShouldHavePreviousValue(new CustodyLocation(body, application), 'taskList')
})
