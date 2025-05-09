import { Form } from '../utils/decorators'
import BaseForm from '../baseForm'
import BeforeYouStart from './before-you-start'
import AreaAndFunding from './area-and-funding'
import AboutPerson from './about-the-person'
import OffencesAndConcerns from './offences-and-concerns'
import CheckYourAnswers from './check-your-answers'
import HealthNeeds from './health-needs'
import BailInformation from './bail-information'

@Form({
  sections: [
    BeforeYouStart,
    AboutPerson,
    AreaAndFunding,
    OffencesAndConcerns,
    HealthNeeds,
    BailInformation,
    CheckYourAnswers,
  ],
})
export default class Apply extends BaseForm {}
