/* eslint-disable import/prefer-default-export */
import { ApplicationDocument, QuestionAndAnswer } from '@approved-premises/ui'
import { getSections, getTaskAnswersAsSummaryListItems } from '../checkYourAnswersUtils'
import { Cas2v2Application as Application } from '../../@types/shared'

export const buildDocument = (application: Application): ApplicationDocument => {
  return {
    sections: getSections().map(section => {
      return {
        title: section.title,
        tasks: section.tasks.map(task => {
          return {
            title: task.title,
            questionsAndAnswers: getTaskAnswersAsSummaryListItems(
              task.id,
              application,
              'document',
            ) as Array<QuestionAndAnswer>,
          }
        }),
      }
    }),
  }
}
