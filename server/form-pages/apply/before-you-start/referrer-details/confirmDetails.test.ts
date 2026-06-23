import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { DataServices } from '@approved-premises/ui'
import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import ConfirmDetails from './confirmDetails'
import { applicationFactory, cas2v2UserDtoFactory, personFactory } from '../../../../testutils/factories/index'

describe('ConfirmDetails', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })
  const userDetails = cas2v2UserDtoFactory.build()
  const token = 'token'
  const username = 'user'
  const dataServices: DeepMocked<DataServices> = createMock<DataServices>()

  itShouldHaveNextValue(new ConfirmDetails({}, application, userDetails), 'job-title')
  itShouldHavePreviousValue(new ConfirmDetails({}, application, userDetails), 'taskList')

  it('initializes the form and retrieves the user details', () => {
    ConfirmDetails.initialize({}, application, { user: { token, username } }, dataServices)
    expect(dataServices.userService.getUserDetails).toHaveBeenCalledWith(token, username)
  })

  it('writes the user name and email to the referrerDetails property', () => {
    const page = new ConfirmDetails({}, application, userDetails)

    expect(page.referrerDetails).toEqual({
      name: application.createdBy.name,
      email: application.createdBy.email,
      region: userDetails.deliusUserInfo.probationArea.description,
    })
  })

  describe('errors', () => {
    it('not implemented', () => {
      const page = new ConfirmDetails({}, application, userDetails)

      expect(page.errors()).toEqual({})
    })
  })
})
