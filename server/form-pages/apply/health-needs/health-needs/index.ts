/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import CommunicationAndLanguageRelevanceCheck from './communicationAndLanguageRelevanceCheck'
import BrainInjury from './brainInjury'
import BrainInjuryDetails from './brainInjuryDetails'
import CommunicationAndLanguage from './communicationAndLanguage'
import HealthNeedsInformation from './healthNeedsInformation'
import LearningDifficultiesDetails from './learningDifficultiesDetails'
import MentalHealth from './mentalHealth'
import OtherHealth from './otherHealth'
import PhysicalHealth from './physicalHealth'
import SubstanceMisuse from './substanceMisuse'
import LiaisonAndDiversion from './liaisonAndDiversion'
import InformationSources from './informationSources'

@Task({
  name: 'Add health needs',
  slug: 'health-needs',
  pages: [
    LiaisonAndDiversion,
    HealthNeedsInformation,
    SubstanceMisuse,
    PhysicalHealth,
    MentalHealth,
    CommunicationAndLanguageRelevanceCheck,
    CommunicationAndLanguage,
    LearningDifficultiesDetails,
    BrainInjury,
    BrainInjuryDetails,
    OtherHealth,
    InformationSources,
  ],
})
export default class HealthNeeds {}
