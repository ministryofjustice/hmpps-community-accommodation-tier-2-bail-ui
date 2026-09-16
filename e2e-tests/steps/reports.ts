import { Page, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { unzipSync, strFromU8 } from 'fflate'

const reportTypeMetaData = {
  submittedApplications: {
    columnNames: [
      'eventId',
      'applicationId',
      'personCrn',
      'personNoms',
      'referringPrisonCode',
      'preferredAreas',
      'hdcEligibilityDate',
      'conditionalReleaseDate',
      'submittedAt',
      'submittedBy',
      'startedAt',
    ],
    callToAction: "Download 'Submitted applications' report",
  },
  applicationStatusUpdates: {
    columnNames: ['eventId', 'applicationId', 'personCrn', 'personNoms', 'updatedBy', 'updatedAt', 'newStatus'],
    callToAction: "Download 'Application status updates' report",
  },
  unsubmittedApplications: {
    columnNames: ['applicationId', 'personCrn', 'personNoms', 'startedBy', 'startedAt'],
    callToAction: "Download 'Un-submitted applications' report",
  },
}

type ReportType = keyof typeof reportTypeMetaData

export const manageInformationReports = async (page: Page) => {
  await page.goto('/reports')
  await expect(page.locator('h1')).toContainText('Management information reports')
}

export const downloadReport = async (reportType: ReportType, page: Page) => {
  const downloadPromise = page.waitForEvent('download', { timeout: 10000 })
  await page.getByRole('button', { name: reportTypeMetaData[reportType].callToAction }).click()
  const download = await downloadPromise
  const path = await download.path()
  return path
}

export const confirmColumnNames = (reportType: ReportType, path: string) => {
  const files = unzipSync(new Uint8Array(readFileSync(path)))
  const xml = Object.entries(files)
    .filter(([name]) => name.startsWith('xl/'))
    .map(([, data]) => strFromU8(data))
    .join('')

  reportTypeMetaData[reportType].columnNames.forEach(columnName => {
    expect(xml.includes(columnName)).toBe(true)
  })
}
