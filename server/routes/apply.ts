/* istanbul ignore file */

import type { Router } from 'express'
import Apply from '../form-pages/apply'

import type { Controllers } from '../controllers'
import paths from '../paths/apply'
import { Services } from '../services'
import { actions } from './utils'

export default function applyRoutes(controllers: Controllers, router: Router, services: Services): Router {
  const { pages } = Apply
  const { get, post, put } = actions(router, services.auditService)

  const { applicationsController, pagesController, cancelController } = controllers

  get(
    paths.applications.beforeYouStart.pattern,
    (req, res, next) => {
      res.render('applications/before-you-start')
    },
    { auditEvent: 'VIEW_APPLICATION_BEFORE_YOU_START' },
  )

  get(paths.applications.applicationOrigin.pattern, applicationsController.applicationOrigin(), {
    auditEvent: 'VIEW_APPLICATION_ORIGIN',
  })

  get(paths.applications.searchByPrisonNumber.pattern, applicationsController.searchByPrisonNumber(), {
    auditEvent: 'VIEW_APPLICATION_SEARCH_BY_PRISON_NUMBER',
  })

  get(paths.applications.searchByCrn.pattern, applicationsController.searchByCrn(), {
    auditEvent: 'VIEW_APPLICATION_SEARCH_BY_CRN',
  })

  get(
    paths.applications.unauthorisedCourtBailApplication.pattern,
    applicationsController.unauthorisedCourtBailApplication(),
    {
      auditEvent: 'VIEW_APPLICATION_UNAUTHORISED_COURT_BAIL',
    },
  )

  get(
    paths.applications.unauthorisedPrisonBailApplication.pattern,
    applicationsController.unauthorisedPrisonBailApplication(),
    {
      auditEvent: 'VIEW_APPLICATION_UNAUTHORISED_PRISON_BAIL',
    },
  )

  post(paths.applications.selectApplicationOrigin.pattern, applicationsController.selectApplicationOrigin(), {
    auditEvent: 'VIEW_APPLICATION_SELECT_APPLICATION_ORIGIN',
  })
  get(paths.applications.index.pattern, applicationsController.index(), { auditEvent: 'VIEW_APPLICATIONS_LIST' })
  get(paths.applications.show.pattern, applicationsController.show(), { auditEvent: 'VIEW_APPLICATION_START' })
  post(paths.applications.submission.pattern, applicationsController.submit(), { auditEvent: 'SUBMIT_APPLICATION' })
  post(paths.applications.create.pattern, applicationsController.create(), { auditEvent: 'CREATE_APPLICATION' })
  put(paths.applications.update.pattern, applicationsController.update(), { auditEvent: 'UPDATE_APPLICATION' })
  get(paths.applications.overview.pattern, applicationsController.overview(), {
    auditEvent: 'VIEW_SUBMITTED_APPLICATION_OVERVIEW_AS_REFERRER',
  })

  put(paths.applications.appendToList.pattern, applicationsController.appendToList(), {
    auditEvent: 'UPDATE_APPLICATION_LIST',
  })
  get(paths.applications.removeFromList.pattern, applicationsController.removeFromList(), {
    auditEvent: 'UPDATE_APPLICATION_LIST_REMOVE',
  })
  get(paths.applications.ineligible.pattern, applicationsController.ineligible(), {
    auditEvent: 'VIEW_APPLICATION_INELIGIBLE',
  })

  Object.keys(pages).forEach((taskKey: string) => {
    Object.keys(pages[taskKey as keyof typeof pages]).forEach((pageKey: string) => {
      const { pattern } = paths.applications.show.path(`tasks/${taskKey}/pages/${pageKey}`)

      get(pattern, pagesController.show(taskKey, pageKey), {
        auditEvent: 'VIEW_APPLICATION_PAGE',
        additionalMetadata: { task: taskKey, page: pageKey },
      })
      put(pattern, pagesController.update(taskKey, pageKey), {
        auditEvent: `UPDATE_APPLICATION_PAGE`,
        additionalMetadata: { task: taskKey, page: pageKey },
        redirectAuditEventSpecs: [
          {
            // If we redirect to the same page, the user has hit an error
            path: pattern,
            auditEvent: 'UPDATE_APPLICATION_PAGE_FAILURE',
          },
          {
            // If we redirect to the task list page, the application updated successfully
            path: paths.applications.show.pattern,
            auditEvent: 'UPDATE_APPLICATION_PAGE_SUCCESS',
          },
          {
            // If we redirect to another application page, the application updated successfully
            path: paths.applications.pages.show.pattern,
            auditEvent: 'UPDATE_APPLICATION_PAGE_SUCCESS',
          },
        ],
      })
    })
  })

  post(paths.applications.addNote.pattern, applicationsController.addNote(), {
    auditEvent: 'CREATE_APPLICATION_NOTE_AS_REFERRER',
  })

  get(paths.applications.cancel.pattern, cancelController.new(), {
    auditEvent: 'VIEW_CANCEL_APPLICATION_PAGE',
  })

  post(paths.applications.cancel.pattern, cancelController.update(), {
    auditEvent: 'CANCEL_APPLICATION_AS_REFERRER',
  })

  get(paths.applications.confirmSubmission.pattern, applicationsController.confirmSubmission(), {
    auditEvent: 'CONFIRM_APPLICATION_SUBMISSION',
  })

  return router
}
