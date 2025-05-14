import { Cas2v2Application as Application } from '../../../../../server/@types/shared/models/Cas2v2Application'
import ApplyPage from '../../applyPage'
import paths from '../../../../../server/paths/apply'

export default class YouMustContactTheCppPage extends ApplyPage {
  constructor(private readonly application: Application) {
    super(
      'You must contact the CPP before entering the risk levels',
      application,
      'add-probation-supervision-details',
      'you-must-contact-the-cpp',
    )
  }

  static visit(application: Application): void {
    cy.visit(
      paths.applications.pages.show({
        id: application.id,
        task: 'add-probation-supervision-details',
        page: 'you-must-contact-the-cpp',
      }),
    )
  }

  clickChangeYourAnswer(): void {
    this.clickLink('Change your answer about contacting the CPP')
  }
}
