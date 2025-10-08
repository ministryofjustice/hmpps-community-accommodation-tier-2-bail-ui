import { Cas2v2Application as Application } from '@approved-premises/api'
import { UiTask } from '@approved-premises/ui'
import { FullPerson } from '../../../../../server/@types/shared/models/FullPerson'
import ApplyPage from '../../applyPage'
import { nameOrPlaceholderCopy, stringToKebabCase, htmlToPlainText } from '../../../../../server/utils/utils'
import { getQuestions } from '../../../../../server/form-pages/utils/questions'
import { getPage, getSections, hasResponseMethod } from '../../../../../server/utils/checkYourAnswersUtils'
import { getCustodyLocation } from '../../../../../server/utils/getApplicationSummaryData'

export default class CheckYourAnswersPage extends ApplyPage {
  constructor(private readonly application: Application) {
    const person = application.person as FullPerson
    super(`Check ${person.name}'s application`, application, 'check-your-answers', 'check-your-answers')
  }

  hasExpectedSummaryData(): void {
    const person = this.application.person as FullPerson
    const prisonName = getCustodyLocation(this.application)

    cy.get('#application-summary').within(() => {
      cy.get('span').contains(person.nomsNumber)
      cy.get('li').contains(this.application.createdBy.name)
      cy.get('li').contains(prisonName)
      cy.get('li').contains(this.application.createdBy.email)
      cy.get('li').contains(this.application.id)
    })
  }

  shouldShowAnswersForTask(task: UiTask): void {
    this.shouldShowCheckYourAnswersTitle(task.id, task.title)
    this.shouldShowQuestionsAndAnswers(task.id)
  }

  shouldShowCheckYourAnswersTitle(taskName: string, taskTitle: string) {
    cy.get(`[data-cy-check-your-answers-section="${taskName}"]`).within(() => {
      cy.get('.govuk-summary-card__title').should('contain', taskTitle)
    })
  }

  shouldShowQuestionsAndAnswers(task: string) {
    const pagesToExclude = ['add-acct-note']
    const pageKeys = Object.keys(this.application.data[task])
    pageKeys.forEach(pageKey => {
      if (pagesToExclude.includes(pageKey)) {
        return
      }
      const PageClass = getPage(task, pageKey)
      const page = new PageClass(this.application.data[task][pageKey], this.application)
      const testId = `${task}-${pageKey}`
      if (hasResponseMethod(page)) {
        const response = page.response()
        Object.keys(response).forEach((question, index) => {
          this.checkTermAndDescriptionForAnswers(htmlToPlainText(question), response[question], `${testId}-${index}`)
        })
      } else {
        const pageData = this.application.data[task][pageKey]
        const questionKeys = Object.keys(pageData)
        const questions = getQuestions(nameOrPlaceholderCopy(this.application.person))[task][pageKey]
        cy.get(`[data-cy-check-your-answers-section="${task}"]`).within(() => {
          questionKeys.forEach((questionKey, index) => {
            if (!pageData[questionKey]) {
              return
            }

            const questionText = questions[questionKey]?.question

            if (!questionText) {
              return
            }

            const predefinedAnswers = questions[questionKey].answers
            let expectedAnswer = ''

            if (Array.isArray(pageData[questionKey])) {
              const items = []
              pageData[questionKey].forEach(answerItem => {
                items.push(predefinedAnswers[answerItem])
              })
              expectedAnswer = items.toString()
            } else if (predefinedAnswers) {
              expectedAnswer = predefinedAnswers[pageData[questionKey]]
            } else {
              expectedAnswer = pageData[questionKey]
            }

            this.checkTermAndDescriptionForAnswers(questionText, expectedAnswer, `${testId}-${index}`)
          })
        })
      }
    })
  }

  shouldNotShowAnswersWithoutQuestions() {
    cy.get('main').should('not.contain', 'this answer should not appear')
  }

  shouldShowSideNavBar() {
    const sections = getSections()

    sections.forEach(section => {
      section.tasks.forEach(task => {
        cy.get(`a[href="#${stringToKebabCase(task.title)}"]`)
      })
    })
  }
}
