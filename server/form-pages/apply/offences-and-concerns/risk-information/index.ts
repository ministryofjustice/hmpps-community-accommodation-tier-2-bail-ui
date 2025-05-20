/* istanbul ignore file */
import Concerns from './concerns'
import SelfHarm from './selfHarm'
import Acct from './acct'
import AddAcctNote from './custom-forms/addAcctNote'
import ViolenceAndArson from './violenceAndArson'
import LivingInTheCommunity from './livingInTheCommunity'
import SafetyOfStaff from './safetyOfStaff'
import AdditionalConcerns from './additionalConcerns'
import RiskManagementArrangements from './riskManagementArrangements'
import InformationSources from './informationSources'
import DoesTheApplicantHaveAcctNotes from './doesTheApplicantHaveAcctNotes'
import DetailsOfDomesticAbuseConcerns from './detailsOfDomesticAbuseConcerns'
import DomesticAbuseConcerns from './domesticAbuseConcerns'

import { Task } from '../../../utils/decorators'

@Task({
  name: 'Add information about concerns to the applicant and others',
  slug: 'risk-information',
  pages: [
    Concerns,
    SelfHarm,
    DoesTheApplicantHaveAcctNotes,
    Acct,
    AddAcctNote,
    DomesticAbuseConcerns,
    DetailsOfDomesticAbuseConcerns,
    ViolenceAndArson,
    LivingInTheCommunity,
    SafetyOfStaff,
    AdditionalConcerns,
    RiskManagementArrangements,
    InformationSources,
  ],
})
export default class RiskInformation {}
