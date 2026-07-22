import { ApplicationDocument, QuestionAndAnswer } from '@approved-premises/ui'
import { getSections, getTaskAnswersAsSummaryListItems, taskAppliesToApplication } from '../checkYourAnswersUtils'
import { Cas2Application as Application } from '../../@types/shared'

export const buildDocument = (application: Application): ApplicationDocument => {
  return {
    sections: getSections()
      .map(section => {
        return {
          title: section.title,
          tasks: section.tasks
            .filter(task => taskAppliesToApplication(task, application))
            .map(task => {
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
      })
      .filter(section => section.tasks.length > 0),
  }
}

export const filterDocumentToApplicableTasks = (application: Application): ApplicationDocument => {
  const document = application.document as ApplicationDocument

  const applicableTaskTitles = new Set(
    getSections().flatMap(section =>
      section.tasks.filter(task => taskAppliesToApplication(task, application)).map(task => task.title),
    ),
  )

  return {
    sections: document.sections
      .map(section => {
        return { ...section, tasks: section.tasks.filter(task => applicableTaskTitles.has(task.title)) }
      })
      .filter(section => section.tasks.length > 0),
  }
}
