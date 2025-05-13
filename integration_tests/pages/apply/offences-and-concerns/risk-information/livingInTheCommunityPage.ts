import { Cas2v2Application as Application } from '@approved-premises/api'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'
import { pageIsActiveInNavigation } from '../../../utils'
import { nameOrPlaceholderCopy } from '../../../../../server/utils/utils'

export default class LivingInTheCommunityPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      `Concerns related to ${nameOrPlaceholderCopy(application.person)} living in the community`,
      application,
      'risk-information',
      'living-in-the-community',
    )
    pageIsActiveInNavigation('Living in the community')
  }

  static visit(application: Application): LivingInTheCommunityPage {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'risk-information',
        page: 'living-in-the-community',
      }),
    )

    return new LivingInTheCommunityPage(application)
  }

  hasGuidanceText = (): void => {
    cy.get('.guidance').contains('behaviours that might impact any of')
    cy.get('.guidance').contains('victims')
    cy.get('.guidance').contains('known adults')
    cy.get('.guidance').contains('children')
    cy.get('.guidance').contains('residents of shared accommodation')
    cy.get('.guidance').contains('members of the LGBTQ+ community')
    cy.get('.guidance').contains('public')
    cy.get('.guidance').contains('specific ethnic minorities or religious groups')
    cy.get('.guidance').contains('not exhaustive')
  }

  enterConvictionDetails = (): void => {
    this.checkRadioByNameAndValue('convictionsRelatedToHateOrAggression', 'yes')
    this.getTextInputByIdAndEnterDetails('convictionsDetail', 'some details')
  }

  enterVictimDetails = (): void => {
    this.checkRadioByNameAndValue('victimOfOthers', 'yes')
    this.getTextInputByIdAndEnterDetails('victimOfOthersDetail', 'some details')
  }

  enterOtherConcerns = (): void => {
    this.checkRadioByNameAndValue('otherConcerns', 'yes')
    this.getTextInputByIdAndEnterDetails('otherConcernsDetail', 'some details')
  }

  enterCSRADetails = (): void => {
    this.checkRadioByNameAndValue('cellSharingRiskAssessment', 'yes')
    this.getTextInputByIdAndEnterDetails('cellSharingRiskAssessmentDetail', 'some details')
  }
}
