/* istanbul ignore file */

import { Task } from '../../../utils/decorators'
import BrainInjury from './brainInjury'
import CommunicationAndLanguage from './communicationAndLanguage'
import Guidance from './guidance'
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
    Guidance,
    SubstanceMisuse,
    PhysicalHealth,
    MentalHealth,
    CommunicationAndLanguage,
    LearningDifficulties,
    BrainInjury,
    LiaisonAndDiversion,
    OtherHealth,
  ],
})
export default class HealthNeeds {}
