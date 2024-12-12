import { Form } from '../utils/decorators'
import BaseForm from '../baseForm'
import BeforeYouStart from './before-you-start'
import AreaAndFunding from './area-and-funding'
import AboutPerson from './about-the-person'
import RisksAndNeeds from './risks-and-needs'
import CheckYourAnswers from './check-your-answers'
import OffenceInformation from './offence-information'

@Form({
  sections: [BeforeYouStart, AboutPerson, AreaAndFunding, RisksAndNeeds, OffenceInformation, CheckYourAnswers],
})
export default class Apply extends BaseForm {}
