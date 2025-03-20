/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import BrainInjury from './brainInjury'
import CommunicationAndLanguage from './communicationAndLanguage'
import HealthNeedsInformation from './healthNeedsInformation'
import LearningDifficulties from './learningDifficulties'
import MentalHealth from './mentalHealth'
import OtherHealth from './otherHealth'
import PhysicalHealth from './physicalHealth'
import SubstanceMisuse from './substanceMisuse'
import LiaisonAndDiversion from './liaisonAndDiversion'

@Task({
  name: 'Add health needs',
  slug: 'health-needs',
  pages: [
    LiaisonAndDiversion,
    HealthNeedsInformation,
    SubstanceMisuse,
    PhysicalHealth,
    MentalHealth,
    CommunicationAndLanguage,
    LearningDifficulties,
    BrainInjury,
    OtherHealth,
  ],
})
export default class HealthNeeds {}
