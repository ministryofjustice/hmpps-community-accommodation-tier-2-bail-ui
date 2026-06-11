import { YesNoOrDontKnow } from '@approved-premises/ui'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import Orders from './orders'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('Orders', () => {
  const bailApplication = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const nonBailApplication = applicationFactory.newCohort().build()

  const ordersPage = new Orders({}, bailApplication)

  describe('Routes', () => {
    itShouldHaveNextValue(ordersPage, '')
    itShouldHavePreviousValue(ordersPage, 'licence-conditions')
  })

  describe('errors', () => {
    it('returns an error if contact number is missing', () => {
      expect(ordersPage.errors()).toEqual({
        hasOrders: 'Select yes if they are subject to any civil or criminal orders',
      })
    })
  })

  describe('onSave', () => {
    it('Clears unused notes', () => {
      const body = {
        hasOrders: 'no' as YesNoOrDontKnow,
        notes: 'lorem ipsum',
      }
      const page = new Orders(body, nonBailApplication)

      expect(page.body).toEqual(body)
      page.onSave()
      expect(page.body).toEqual({ hasOrders: 'no' })
    })
  })
})
