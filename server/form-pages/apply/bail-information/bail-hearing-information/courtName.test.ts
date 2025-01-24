import { itShouldHaveNextValue, itShouldHavePreviousValue } from '../../../shared-examples'
import CourtName from './courtName'
import { applicationFactory, personFactory } from '../../../../testutils/factories/index'

describe('CourtName', () => {
  const application = applicationFactory.build({ person: personFactory.build({ name: 'Roger Smith' }) })

  itShouldHavePreviousValue(new CourtName({}, application), 'bail-hearing-arranger')
  itShouldHaveNextValue(new CourtName({}, application), 'bail-hearing-date')
})
